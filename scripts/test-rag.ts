import { createClient } from '@supabase/supabase-js';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Hugging Face for embeddings
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
  });

  const embedding = Array.isArray(response) ? response : Object.values(response);

  if (embedding.length !== 384) {
    throw new Error(`Expected 384 dimensions, got ${embedding.length}`);
  }

  return embedding as number[];
}

async function testRAG() {
  console.log('🔍 Testing RAG System\n');

  // Test queries
  const testQueries = [
    // General Identity
    "Who is Syed Ali Abbas?",
    
    // Specific Project Details
    "What tech stack was used for Sapiens Nova Academy?",
    "How did he implement the RAG pipeline for HP?",
    "Tell me about his robotics projects.",
    
    // Contact Info
    "How can I contact Syed?",
    
    // Irrelevant / Low Similarity Expected
    "What is the capital of France?",
    "How do I bake a cake?",
    "What is the weather in Tokyo?"
  ];

  for (const query of testQueries) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Query: "${query}"`);
    console.log('='.repeat(80));

    try {
      // Generate embedding for query
      const embedding = await generateEmbedding(query);
      console.log(`✅ Generated embedding (${embedding.length} dimensions)`);

      // Test with different thresholds
      const thresholds = [0.1, 0.2, 0.3, 0.4, 0.5];

      // Convert embedding to string format for pgvector
      const embeddingString = `[${embedding.join(',')}]`;

      for (const threshold of thresholds) {
        const { data, error } = await supabase.rpc('match_documents', {
          query_embedding: embeddingString,
          match_threshold: threshold,
          match_count: 5,
        });

        if (error) {
          console.error(`❌ Error at threshold ${threshold}:`, error);
          continue;
        }

        console.log(`\n📊 Results with threshold ${threshold}:`);
        if (!data || data.length === 0) {
          console.log(`   No documents found`);
        } else {
          console.log(`   Found ${data.length} documents:`);
          data.forEach((doc: any, idx: number) => {
            console.log(`   ${idx + 1}. ${doc.metadata.title} (similarity: ${doc.similarity.toFixed(4)})`);
            console.log(`      Source: ${doc.metadata.source}, Type: ${doc.metadata.type}`);
            console.log(`      Preview: ${doc.content.substring(0, 100)}...`);
          });
        }
      }

    } catch (error) {
      console.error('❌ Error testing query:', error);
    }

    // Small delay between queries
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n\n🔍 Checking all documents in database:');
  const { data: allDocs, error: allError, count } = await supabase
    .from('documents')
    .select('id, metadata, embedding', { count: 'exact' });

  if (allError) {
    console.error('❌ Error fetching all documents:', allError);
  } else {
    console.log(`\n📚 Total documents in database: ${count}`);
    if (allDocs && allDocs.length > 0) {
      console.log('\nDocument titles:');
      allDocs.forEach((doc: any, idx: number) => {
        const embedding = doc.embedding;
        let embeddingStatus = '❌ Missing';
        
        if (embedding) {
          if (typeof embedding === 'string') {
            embeddingStatus = `✅ String format (${embedding.substring(0, 50)}...)`;
          } else if (Array.isArray(embedding)) {
            embeddingStatus = `✅ Array (${embedding.length} dims)`;
          } else {
            embeddingStatus = `⚠️ Unknown type: ${typeof embedding}`;
          }
        }
        
        console.log(`  ${idx + 1}. ${doc.metadata.title}`);
        console.log(`      Embedding: ${embeddingStatus}`);
      });
    }
  }
}

// Run the test
testRAG()
  .then(() => {
    console.log('\n✨ RAG testing completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
