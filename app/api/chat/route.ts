import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Hugging Face
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    // 1. Generate Embedding for the query
    const embeddingResponse = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: query,
    });
    
    // Ensure embedding is a flat array of numbers
    let embedding: number[];
    if (Array.isArray(embeddingResponse) && Array.isArray(embeddingResponse[0])) {
      embedding = embeddingResponse[0] as number[];
    } else {
      embedding = embeddingResponse as number[];
    }

    // 2. Search for relevant documents in Supabase
    const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.1, // Adjust threshold as needed
      match_count: 5,
    });

    if (searchError) {
      console.error('Vector search error:', searchError);
    }

    // 3. Construct Context
    const contextText = documents
      ?.map((doc: any) => `[Section: ${doc.metadata.title}]: ${doc.content}`)
      .join('\n\n') || 'No specific context found.';

    // 4. System Prompt
    const systemPrompt = `You are a highly capable AI Assistant for Syed Ali Abbas's portfolio website.

Your goal is to answer questions about Syed Ali Abbas (his background, projects, skills, and interests) using ONLY the context provided below.

=== CONTEXT START ===
${contextText}
=== CONTEXT END ===

Guidelines:
1. **Be Specific**: Use the details from the context to provide informative answers.
2. **Be Professional & Friendly**: Maintain a helpful, professional, and welcoming tone.
3. **Handle Unknowns**: If the context doesn't contain the answer, politely state: "I'm sorry, I don't have specific information about that in my knowledge base. You might want to reach out to Syed directly."
4. **No Hallucinations**: Do not make up facts or projects that are not in the context.
5. **Markdown Formatting**: Use Markdown for readability (bolding, lists, etc.).
6. **Contact Info**: If asked for contact details, provide: **syed.ali.abbas@ucl.ac.uk**.

User's Query: ${query}
`;

    const allMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(0, -1).map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: query }
    ];

    // 5. Generate Response with Groq (Streaming)
    const completion = await groq.chat.completions.create({
      messages: allMessages,
      model: 'llama-3.3-70b-versatile', // or 'mixtral-8x7b-32768'
      stream: true,
      temperature: 0.6,
      max_tokens: 1024,
    });

    // 6. Return Streaming Response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          console.error('Streaming error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
