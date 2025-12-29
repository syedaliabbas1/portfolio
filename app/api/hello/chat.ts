import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';

export const prerender = false;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Input validation constants
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES_IN_HISTORY = 20;
const MIN_MESSAGE_LENGTH = 1;

// Initialize Groq for Llama
const groq = new Groq({
  apiKey: import.meta.env.GROQ_API_KEY,
});

// Initialize Hugging Face for FREE embeddings
const hf = new HfInference(import.meta.env.HUGGINGFACE_API_KEY);

// Initialize Supabase
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Helper: Get client IP
function getClientIP(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

// Helper: Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// Helper: Sanitize user input
function sanitizeInput(text: string): string {
  return text
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH)
    .replace(/\[INST\]/gi, '')
    .replace(/\[\/INST\]/gi, '')
    .replace(/<\|im_start\|>/gi, '')
    .replace(/<\|im_end\|>/gi, '');
}

// Helper: Validate message structure
function validateMessages(messages: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }

  if (messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' };
  }

  if (messages.length > MAX_MESSAGES_IN_HISTORY) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES_IN_HISTORY})` };
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return { valid: false, error: 'Each message must have role and content' };
    }

    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: 'Invalid message role' };
    }

    if (typeof msg.content !== 'string') {
      return { valid: false, error: 'Message content must be a string' };
    }

    // Only validate length for user messages (assistant responses can be longer)
    if (msg.role === 'user' && msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` };
    }

    if (msg.content.trim().length < MIN_MESSAGE_LENGTH) {
      return { valid: false, error: 'Message cannot be empty' };
    }
  }

  const lastMsg = messages[messages.length - 1];
  if (lastMsg.role !== 'user') {
    return { valid: false, error: 'Last message must be from user' };
  }

  return { valid: true };
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
  });

  const embedding = Array.isArray(response) ? response : Object.values(response);

  // Validate embedding dimension
  if (embedding.length !== 384) {
    throw new Error(`Expected 384 dimensions, got ${embedding.length}`);
  }

  return embedding as number[];
}

async function searchSimilarDocuments(query: string, matchCount: number = 5) {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    // Convert to string format for pgvector
    const embeddingString = `[${embedding.join(',')}]`;

    // Search for similar documents with lower threshold for better recall
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embeddingString,
      match_threshold: 0.1,  // Lower threshold to get more relevant results
      match_count: matchCount,
    });

    if (error) {
      console.error('Error searching documents:', error);
      return [];
    }

    console.log(`Found ${data?.length || 0} documents for query: "${query.substring(0, 50)}..."`);
    if (data && data.length > 0) {
      console.log('Top match:', data[0].metadata.title, 'Similarity:', data[0].similarity);
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchSimilarDocuments:', error);
    return [];
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitCheck = checkRateLimit(clientIP);

    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitCheck.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitCheck.retryAfter)
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { messages } = body;

    // Validate messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize user input
    const sanitizedMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: sanitizeInput(msg.content),
    }));

    // Get last user message
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];

    // Search for relevant context
    const relevantDocs = await searchSimilarDocuments(lastMessage.content, 5);

    // Build context from relevant documents
    const context = relevantDocs
      .map((doc: any) => `${doc.content}`)
      .join('\n\n');

    // System prompt with RAG context
    const systemPrompt = `You are a helpful assistant for Sapiens Nova Academy (SNA), an innovative educational institution focused on technology, entrepreneurship, and innovation for Year 9-13 students.

Your role:
- Answer questions about SNA's programs, admissions, locations, and partnerships using the provided context
- Be friendly, encouraging, and professional
- Speak in a tone appropriate for teenagers and their parents
- If information isn't in the context, politely admit it and suggest contacting the academy directly
- Keep responses concise (2-3 paragraphs maximum)
- Focus on inspiring students about technology and entrepreneurship opportunities
- When discussing programs, mention key features like certificates, guest speakers, and hands-on learning

**FORMATTING INSTRUCTIONS** (Use Markdown):
- Use **bold** for important information like names, email addresses, program names, and key details
- Use bullet points (- or *) for lists of features, programs, or options
- Use headings (## or ###) when organizing longer responses with multiple sections
- Highlight contact emails like **benny.lo@themnacademy.com** in bold
- Use *italics* for emphasis on notable features
- Keep formatting clean and readable for mobile chat interface

${context ? `=== KNOWLEDGE BASE CONTEXT ===\n\n${context}\n\n=== END CONTEXT ===\n\nPlease answer the user's question based STRICTLY on the information above. If the context doesn't contain the answer, say so and suggest contacting the academy.` : 'No specific context found in the knowledge base. Provide a general response about SNA and suggest contacting the academy for specific details at **benny.lo@themnacademy.com** or **sammi.wong@themnacademy.com**.'}

Important guidelines:
- Base your answers ONLY on the provided context above
- If asked about costs, specific dates, or enrollment details not in the context, direct users to contact:
  - **Professor Benny Lo**: benny.lo@themnacademy.com
  - **Professor Sammi Wong**: sammi.wong@themnacademy.com
  - **Website**: www.themnacademy.com`;

    // Prepare messages for Groq
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call Groq with Llama model (streaming enabled)
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages as any,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: true,
    });

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Don't expose internal error details to client
    const errorMessage = error instanceof Error
      ? (error.message.includes('rate limit')
          ? 'API rate limit exceeded. Please try again in a moment.'
          : 'An error occurred processing your request.')
      : 'An unexpected error occurred.';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
