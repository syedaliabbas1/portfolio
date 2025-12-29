# RAG AI Chatbot Implementation Guide

This document serves as a comprehensive instruction manual to implement a **Retrieval-Augmented Generation (RAG) AI Chatbot** for a personal portfolio website.

This implementation is based on a proven architecture using **Groq** for high-speed inference and **Supabase** for vector storage.

---

## 🏗️ Technical Architecture

- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL + `pgvector` extension)
- **AI Inference:** Groq SDK (gpt-oss-120b)
- **Embeddings:** Hugging Face Inference API (`sentence-transformers/BGE-M3`)
- **Styling:** Tailwind CSS

---

## 📋 Implementation Steps for Gemini

### Phase 1: Dependencies & Configuration

1.  **Install Required Packages:**
    Run the following command to install the necessary libraries:
    ```bash
    npm install @supabase/supabase-js groq-sdk @huggingface/inference react-markdown remark-gfm framer-motion lucide-react clsx tailwind-merge
    ```

2.  **Environment Variables:**
    Create/Update `.env` with these keys:
    ```env
    PUBLIC_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    GROQ_API_KEY=your_groq_api_key
    HUGGINGFACE_API_KEY=your_huggingface_api_key
    ```

### Phase 2: Database Setup (Supabase)

Create a SQL migration file (e.g., `supabase/migrations/001_setup_rag.sql`) with the following content. This enables vector search and creates the storage for your portfolio content.

```sql
-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your portfolio content
create table documents (
  id bigserial primary key,
  content text, -- The actual text (Bio, Project Description, etc.)
  metadata jsonb, -- Extra info (Title, Date, Tech Stack)
  embedding vector(384) -- 384 dimensions for all-MiniLM-L6-v2
);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### Phase 3: Data Ingestion Script

Create a script at `C:\Download\portfolio website\Portfolio\scripts`. This script will be run manually to "teach" the AI about you. I have provided you an example injest-documents.ts in the C:\Download\portfolio website\Portfolio\scripts\ingest-documents.ts to follow.

**Key Requirements for the Script:**
- Import `createClient` from `@supabase/supabase-js` and `HfInference` from `@huggingface/inference`.
- Define a list of `documents` (hardcoded for now) representing your portfolio.
  - *Example Data:*
    ```typescript
    const documents = [
      { 
        content: "I am a Full Stack Developer specializing in React and Node.js.", 
        metadata: { title: "Bio", type: "personal" } 
      },
      { 
        content: "I built an E-commerce platform using Next.js and Stripe.", 
        metadata: { title: "Project: E-commerce", type: "project" } 
      }
    ];
    ```
- Iterate through the documents:
  - Generate an embedding using `hf.featureExtraction({ model: 'sentence-transformers/all-MiniLM-L6-v2', inputs: doc.content })`.
  - Insert the `content`, `metadata`, and `embedding` into the `documents` table in Supabase.

### Phase 4: The Chat API (Backend)

Create an API route. I have added a example chat.ts file in the C:\Download\portfolio website\Portfolio\app\api\ for you to reference and use it as the base

**Functional Logic:**
1.  **Initialize SDKs:** Setup Groq, Hugging Face, and Supabase clients.
2.  **Validate Input:** Ensure the user sends an array of messages.
3.  **Generate Embedding:** Convert the *last* user message into a 384-dimension vector using Hugging Face.
4.  **Retrieve Context:** Call `supabase.rpc('match_documents', ...)` to find relevant portfolio info.
5.  **Construct System Prompt:**
    - Role: "You are an AI assistant for Syed Ali Abbas's portfolio."
    - Instruction: "Use the following context to answer the visitor's question. Be professional, concise, and friendly."
    - Context: Append the retrieved text chunks.
6.  **Stream Response:** Use `groq.chat.completions.create({ stream: true, ... })` and return a `ReadableStream` (Server-Sent Events) so the text types out in real-time.

### Phase 5: The Chat Widget (Frontend)

I have provided an example chat widget component in the `C:\Download\portfolio website\Portfolio\components\ui\ChatWidget.tsx`. Use this example as a base to make the Chatwidget for my portfolio website.

**UI Requirements:**
- **Floating Button:** A fixed button (bottom-right) to toggle the chat window.
- **Message List:** Scrollable area displaying User (right aligned) and AI (left aligned) messages.
- **Input Area:** Text input + Send button.
- **Streaming Handler:** Use `fetch` to POST to `/api/chat` and a `ReadableStream` reader to append text chunks to the state as they arrive.
- **Styling:** Use Tailwind CSS for a clean, modern look (rounded corners, shadows, distinctive colors).


