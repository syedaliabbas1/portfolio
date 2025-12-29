import { createClient } from '@supabase/supabase-js';
import { HfInference } from '@huggingface/inference';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Hugging Face for FREE embeddings
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Document {
  content: string;
  metadata: {
    source: string;
    title: string;
    type: string;
  };
}

// Knowledge base about Sapiens Nova Academy
const documents: Document[] = [
  {
    content: `Sapiens Nova Academy Limited (SNA) is a dynamic and innovative educational institution focused on developing tailored and interactive education programmes in technology, innovation, venture investment, and entrepreneurship. SNA's vision is to prepare young adults for future careers as venture capitalists, entrepreneurs, and technology professionals through customised educational experiences that combine academic insight, industry exposure, and hands-on venture creation.`,
    metadata: {
      source: 'about',
      title: 'About Sapiens Nova Academy',
      type: 'general',
    },
  },
  {
    content: `SNA's mission is to empower young adults by fostering innovation and entrepreneurship through transformative education. The academy aims to unlock each student's potential and equip them with the skills and creative mindset needed to thrive in an ever-evolving global economy. Core focus areas include innovation and entrepreneurship, technology venture investment and creation, and emerging technologies like AI and robotics.`,
    metadata: {
      source: 'mission',
      title: 'Mission and Core Focus',
      type: 'general',
    },
  },
  {
    content: `Many SNA programmes are designed for Year 9 to Year 13 students. Participants receive certificates of attendance from partner institutions, credentials that strengthen academic and professional CVs, exposure to guest speakers such as venture capitalists and entrepreneurs, and opportunities for scholarships and additional academic support.`,
    metadata: {
      source: 'students',
      title: 'Target Students and Benefits',
      type: 'educational',
    },
  },
  {
    content: `SNA offers multiple programme types: Customised and Elite Programmes including research publications with top scholars, alumni sharing sessions, elite admissions advisory, and personal development coaching. SNA Institute Programmes include boot camps, hackathons, pitching sessions, workshops, professional sharing events, and startup competitions. All programmes feature coaching by Cambridge-trained psychologists and mentorship from experienced founders and renowned academics.`,
    metadata: {
      source: 'programmes',
      title: 'Programme Types and Services',
      type: 'program',
    },
  },
  {
    content: `SNA offers AI and robotics-focused programmes including boot camps, hackathons, and workshops ranging from 2 days to 15 weeks. These programmes use self-developed robots to support hands-on, real-world learning. Participants learn through applied projects involving AI coding, robotics construction, and venture development.`,
    metadata: {
      source: 'ai-robotics',
      title: 'AI and Robotics Programmes',
      type: 'program',
    },
  },
  {
    content: `SNA offers psychology-based personal development programmes lasting 1 to 2 weeks. These programmes integrate psychometric assessments, including the MBTI, to provide a scientifically grounded approach to self-development. Participants gain insight into personality traits, individual strengths, growth areas, self-awareness, and confidence.`,
    metadata: {
      source: 'personal-growth',
      title: 'Personal Growth Programmes',
      type: 'program',
    },
  },
  {
    content: `The Bespoke Tech Boot Camp at Imperial College London is designed for Year 9-13 students. It focuses on technology venture building, ideation, and prototyping. The programme includes guest speakers from the venture capital and tech industry and participants receive a certificate of attendance from Imperial College London.`,
    metadata: {
      source: 'overseas-uk',
      title: 'Imperial College London Tech Boot Camp',
      type: 'program',
    },
  },
  {
    content: `The Bespoke Tech Boot Camp in Awaji, Japan is delivered in partnership with Pasona Education for Year 9-13 students. The programme focuses on nature, technology, venture building, and well-being. Participants receive a certificate issued by Pasona Education. This unique programme combines technology learning with wellness in a natural Japanese setting.`,
    metadata: {
      source: 'overseas-japan',
      title: 'Japan Tech Boot Camp - Awaji',
      type: 'program',
    },
  },
  {
    content: `The Bespoke China Entrepreneur Tour is designed for Year 9-13 students and focuses on China's startup ecosystem, venture building, and Chinese technology culture. The programme includes guest speakers from China's tech industry and provides ecosystem exposure to participants, helping them understand the unique characteristics of Chinese entrepreneurship and innovation.`,
    metadata: {
      source: 'overseas-china',
      title: 'China Entrepreneur Tour',
      type: 'program',
    },
  },
  {
    content: `SNA has impressive credentials since January 2025: Over 350 students enrolled in SNA programmes, strategic partnerships with Imperial College London, Chulalongkorn University, British educational institutions, Pasona Education, and University of Hong Kong Summer Institute. Programme delivery across multiple countries including Thailand, China, Hong Kong, Japan, UK, and Saudi Arabia.`,
    metadata: {
      source: 'impact',
      title: 'Programme Impact and Credentials',
      type: 'general',
    },
  },
  {
    content: `SNA delivered a comprehensive 15-week venture building programme at Chulalongkorn University School of Integrated Innovation in Thailand for 110 first-year BAScii students. The programme included AI coding, robotic arm construction using 3D printers, idea generation, fundraising and venture evaluation, and business presentations. Interactive elements included the "Sapiens Game" for team building and "SuperNova Role Play" for fundraising simulation.`,
    metadata: {
      source: 'thailand-15week',
      title: '15-Week Venture Building Programme Thailand',
      type: 'program',
    },
  },
  {
    content: `SNA partnered with British International School Phuket (BISP) under the Arthit Ourairat Institution to deliver a 2-day Tech and AI Workshop for 20+ Grade 12 students. Students learned fundamentals of AI and Generative AI, robotics concepts, startup ideation, and pitched to senior management. This intensive workshop provides rapid exposure to cutting-edge technology concepts.`,
    metadata: {
      source: 'thailand-workshop',
      title: '2-Day Tech and AI Workshop Thailand',
      type: 'program',
    },
  },
  {
    content: `SNA partnered with HKU Summer Institute at the University of Hong Kong to host a 2-week Nextgen Entrepreneurs Boot Camp. Over 100 students participated from Germany, Russia, USA, UK, Taiwan, Thailand, Singapore, and China. The programme featured exploration of Generative AI and robotics, startup idea development, pitching to judges, and 15+ guest speakers including venture investors, entrepreneurs, engineers, and investment bankers.`,
    metadata: {
      source: 'hku-bootcamp',
      title: '2-Week Nextgen Entrepreneurs Boot Camp HKU',
      type: 'program',
    },
  },
  {
    content: `SNA partnered with Dr. Rina Lai to launch the 2-week "Future by Design" programme at HKU Summer Institute, marking HKU's first summer psychology programme. Over 100 students participated. Key features include psychometric assessments including MBTI, scientifically grounded personal development framework, and focus on personality insights, strengths, and growth areas.`,
    metadata: {
      source: 'future-by-design',
      title: 'Future by Design Psychology Programme',
      type: 'program',
    },
  },
  {
    content: `SNA co-organised the Next3gn Web3 Hackathon with Munich-based W3-FF Venture Builder at Princess Nourah Bint Abdulrahman University in Riyadh, Saudi Arabia. The 3-day event had 100+ participants from 16 nationalities, over 40% female participation, 8 hacking teams and 14 sponsors. It was supported by HRH Princess Nourah AlFaisal. This event increased SNA's visibility in Saudi Arabia and opened pathways for tailored programmes in the region.`,
    metadata: {
      source: 'saudi-hackathon',
      title: 'Next3gn Web3 Hackathon Saudi Arabia',
      type: 'program',
    },
  },
  {
    content: `Professor Benny Lo is Co-Founder and serves as Chief Scientific Officer at Precision Robotics Research Institute, Adjunct Professor at Chulalongkorn University, and Visiting Professor at Imperial College London. He is former Professor at the Hamlyn Centre for Robotic Surgery at Imperial College London and Founding CEO of Precision Robotics HK Limited. He holds a PhD in Computing from Imperial College London.`,
    metadata: {
      source: 'founders',
      title: 'Co-Founder: Professor Benny Lo',
      type: 'leadership',
    },
  },
  {
    content: `Professor Sammi Wong is Co-Founder and Founding Partner of Turbulentos Ventures, a venture studio with operations in Japan, South Korea, Hong Kong, and the UK. She is Adjunct Professor at Chulalongkorn University and former Founding Leader of the US$150M HKSTP Ventures VC Fund. She is a graduate of Oxford University with distinction and a CFA Charterholder.`,
    metadata: {
      source: 'founders',
      title: 'Co-Founder: Professor Sammi Wong',
      type: 'leadership',
    },
  },
  {
    content: `Dr Rina Lai serves as Education and Psychology Advisor. She is Founder of SynergisED (education research and innovation lab), Associate at Faculty of Psychology at Cambridge University, and Fellow of the Royal Society of Arts. She holds a PhD in Education and Psychology from Cambridge University.`,
    metadata: {
      source: 'founders',
      title: 'Education Advisor: Dr Rina Lai',
      type: 'leadership',
    },
  },
  {
    content: `SNA Institute bridges academic research and practical application, conducting research in Artificial Intelligence, Robotics, and Internet of Things (IoT). The Institute offers an Elite Internship Programme providing hands-on research experience in AI, Robotics, and IoT, plus venture building experience for exceptional graduates of SNA programmes.`,
    metadata: {
      source: 'institute',
      title: 'SNA Institute and Research',
      type: 'educational',
    },
  },
  {
    content: `SNA has a unique capability to organise customised programmes in multiple international locations including Hong Kong, Thailand, Japan, China (Shenzhen), United Kingdom, and Saudi Arabia. The academy works with renowned academics from Harvard, MIT, Stanford, EPFL, ETH Zurich, Imperial College London, and Oxbridge, plus senior executives from venture capital, private equity, healthcare, AI, robotics, and life sciences industries.`,
    metadata: {
      source: 'locations',
      title: 'International Locations and Partnerships',
      type: 'general',
    },
  },
  {
    content: `Contact Sapiens Nova Academy: Website: www.themnacademy.com. Email Professor Benny Lo at benny.lo@themnacademy.com. Email Professor Sammi Wong at sammi.wong@themnacademy.com. The academy is responsive to inquiries about customised programmes, elite admissions, boot camps, hackathons, and international educational experiences.`,
    metadata: {
      source: 'contact',
      title: 'Contact Information',
      type: 'general',
    },
  },
];

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

    // Validate embedding dimension
    if (embedding.length !== 384) {
      throw new Error(`Expected 384 dimensions, got ${embedding.length}`);
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function ingestDocuments() {
  console.log('🚀 Starting document ingestion...\n');

  // First, clear existing documents
  console.log('🗑️  Clearing existing documents...');
  const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0);
  
  if (deleteError) {
    console.error('⚠️  Error clearing documents:', deleteError);
  } else {
    console.log('✅ Existing documents cleared\n');
  }

  let successCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      console.log(`📄 Processing: ${doc.metadata.title}`);
      
      // Generate embedding
      const embedding = await generateEmbedding(doc.content);
      console.log(`   Generated embedding: ${embedding.length} dimensions`);
      
      // Convert embedding to string format for pgvector
      const embeddingString = `[${embedding.join(',')}]`;
      
      // Insert into Supabase
      const { data, error } = await supabase.from('documents').insert({
        content: doc.content,
        metadata: doc.metadata,
        embedding: embeddingString,
      }).select();

      if (error) {
        console.error(`❌ Error inserting ${doc.metadata.title}:`, error);
        errorCount++;
      } else {
        console.log(`✅ Successfully inserted: ${doc.metadata.title}`);
        console.log(`   Verified: ${data && data.length > 0 ? 'Data saved' : 'Warning: No data returned'}\n`);
        successCount++;
      }

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error processing ${doc.metadata.title}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Ingestion Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📝 Total: ${documents.length}`);
}

// Run the ingestion
ingestDocuments()
  .then(() => {
    console.log('\n✨ Document ingestion completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
