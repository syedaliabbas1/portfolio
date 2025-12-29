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
