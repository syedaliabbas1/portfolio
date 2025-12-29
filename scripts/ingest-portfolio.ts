import { createClient } from '@supabase/supabase-js';
import { HfInference } from '@huggingface/inference';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });

console.log('DEBUG: PUBLIC_SUPABASE_URL:', process.env.PUBLIC_SUPABASE_URL);


// Initialize Hugging Face for FREE embeddings
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });

    // Ensure embedding is a flat array of numbers
    let embedding: number[];
    if (Array.isArray(response) && Array.isArray(response[0])) {
      embedding = response[0] as number[];
    } else {
      embedding = response as number[];
    }

    if (embedding.length !== 384) {
      throw new Error(`Expected 384 dimensions, got ${embedding.length}`);
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function ingestPortfolio() {
  console.log('🚀 Starting portfolio ingestion...\n');

  const portfolioPath = path.join(__dirname, '..', 'PORTFOLIO.MD');
  
  if (!fs.existsSync(portfolioPath)) {
    console.error(`❌ Error: PORTFOLIO.MD not found at ${portfolioPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(portfolioPath, 'utf-8');

  // Split content by headers (## ) to get sections
  const rawSections = fileContent.split(/^## /gm).slice(1); // Skip the first empty split if any

  console.log(`Found ${rawSections.length} main sections.`);

  // Clear existing documents
  console.log('🗑️  Clearing existing documents...');
  const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0); // Delete all
  if (deleteError) {
    console.error('⚠️  Error clearing documents:', deleteError);
  } else {
    console.log('✅ Existing documents cleared\n');
  }

  let successCount = 0;
  let errorCount = 0;

  for (const section of rawSections) {
    const lines = section.trim().split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();

    if (!content) continue;

    // Further split long sections if needed, but for now we'll ingest the whole section
    // If a section is too long, we might want to split it by subheaders (###)
    
    const subSections = content.split(/^### /gm);
    
    const chunks = [];
    if (subSections.length > 1) {
       // First part might be intro text before first ###
       if (subSections[0].trim().length > 0 && !subSections[0].trim().startsWith('###')) {
           chunks.push({
               title: title,
               content: subSections[0].trim(),
               type: 'section_intro'
           });
       }

       for (let i = 1; i < subSections.length; i++) { // Skip first element if it was handled or empty
           const subLines = subSections[i].trim().split('\n');
           const subTitle = subLines[0].trim();
           const subContent = subLines.slice(1).join('\n').trim();
           
           if(subContent) {
                chunks.push({
                    title: `${title} - ${subTitle}`,
                    content: subContent,
                    type: 'subsection'
                });
           }
       }
       // If the split didn't really work (e.g. no intro), just check if we missed the first one being a subsection
       if(chunks.length === 0 && subSections.length > 0) {
            // It means the split happened but logic above might be slightly off for edge cases,
            // but let's stick to a simpler approach: treat whole section as one if structured parsing fails,
            // or iterate all subSections including 0 if it looks like a header.
            // Simplified approach: Re-do split properly.
       }

    } else {
        chunks.push({
            title: title,
            content: content,
            type: 'section'
        });
    }

    // Actually, let's refine the splitting strategy:
    // 1. If it has '###', split by it.
    // 2. Otherwise use the whole '##' section.
    
    const finalChunks = [];
    
    if (content.includes('###')) {
        const parts = section.split(/^### /gm);
        // parts[0] is the ## Title and intro text
        const mainTitle = parts[0].split('\n')[0].trim();
        const mainIntro = parts[0].split('\n').slice(1).join('\n').trim();
        
        if (mainIntro) {
            finalChunks.push({
                title: mainTitle,
                content: mainIntro,
                type: 'overview'
            });
        }
        
        for (let i = 1; i < parts.length; i++) {
            const partLines = parts[i].trim().split('\n');
            const subTitle = partLines[0].trim();
            const subContent = partLines.slice(1).join('\n').trim();
            if (subContent) {
                finalChunks.push({
                    title: `${mainTitle} - ${subTitle}`,
                    content: subContent,
                    type: 'detail'
                });
            }
        }
    } else {
        finalChunks.push({
            title: title,
            content: content,
            type: 'general'
        });
    }


    for (const chunk of finalChunks) {
        try {
            console.log(`📄 Processing: ${chunk.title}`);
            const embedding = await generateEmbedding(chunk.content);
            const embeddingString = `[${embedding.join(',')}]`;

            const { error } = await supabase.from('documents').insert({
                content: chunk.content,
                metadata: { title: chunk.title, type: chunk.type },
                embedding: embeddingString
            });

            if (error) {
                console.error(`❌ Error inserting ${chunk.title}:`, error);
                errorCount++;
            } else {
                console.log(`✅ Inserted: ${chunk.title}`);
                successCount++;
            }
            
            // Rate limit protection
            await new Promise(r => setTimeout(r, 200));

        } catch (e) {
            console.error(`❌ Failed to process ${chunk.title}`, e);
            errorCount++;
        }
    }
  }

  console.log('\n📊 Ingestion Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
}

ingestPortfolio().catch(console.error);
