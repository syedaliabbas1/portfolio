export const personalInfo = {
  name: "Syed Ali Abbas",
  title: "MEng Computer Science at UCL",
  email: "syed.ali.abbas@ucl.ac.uk",
  location: "London, UK",
  tagline: "Computer Science | AI Systems | Robotics | Applied ML",
  oneLineIdentity: "Computer Science MEng student at UCL specialising in AI systems, applied machine learning, and robotics — building production-grade platforms that bridge research and real-world deployment.",
  social: {
    github: "https://github.com/syedaliabbaas",
    linkedin: "https://linkedin.com/in/syedaliabbaas",
    twitter: "https://twitter.com/syedaliabbaas",
  },
};

export const hero = {
  headline: "Designing intelligent systems at the intersection of AI, software engineering, and real-world impact.",
  subheadline: "MEng Computer Science student at UCL | AI Systems & Robotics | Full-Stack & ML Engineering | Research-Driven Development",
  intro: "I am a Computer Science MEng student at University College London with a First Class average and a strong focus on AI systems engineering, applied machine learning, and robotics. I build end-to-end, production-ready platforms that combine rigorous engineering, modern AI techniques, and thoughtful user experience — from Retrieval-Augmented Generation systems to global EdTech platforms.",
};

export const about = {
  paragraphs: [
    "I am currently pursuing an MEng in Computer Science at University College London, where I hold a First Class average and have been awarded a 100% Undergraduate Global Merit Scholarship. My academic and professional journey is driven by a deep interest in bridging machine learning research with deployable, real-world systems.",
    "My core strengths lie in AI systems engineering, backend and full-stack development, and robotics, with a strong emphasis on clean architecture, scalability, and reliability. I am particularly interested in how large language models, retrieval systems, and intelligent agents can be integrated responsibly into real products — not just as demos, but as robust tools used by real users.",
    "Alongside my academic work, I have contributed to industry-scale projects, including the development of a Retrieval-Augmented Generation (RAG) pipeline with Hewlett-Packard and the end-to-end build of a global EdTech and AI platform (Sapiens Nova Academy) that supports international programmes, secure payments, and AI-powered assistance.",
    "I enjoy operating at the intersection of research and engineering — applying theoretical concepts from machine learning, robotics, and systems design to solve practical problems. Looking ahead, I aim to deepen my expertise in applied ML systems, robotics-integrated intelligence, and AI research, with strong interest in research-oriented roles and future PhD study.",
  ],
};

export interface Project {
  name: string;
  description: string;
  stack: string;
  badges: { name: string }[];
  link: string;
  github: string;
  carousel: { image: string }[];
  featured?: boolean;
  dateRange?: string;
}

export const projects: Project[] = [
  {
    name: "Sapiens Nova Academy",
    description: "End-to-end EdTech platform with AI-powered learning assistant",
    stack: "Sapiens Nova Academy is a global education and innovation platform designed to prepare students for careers in technology and entrepreneurship. Built with Next.js, TypeScript, Tailwind CSS, featuring a Retrieval-Augmented Generation (RAG) assistant powered by LangChain, integrated Stripe payment processing, and PostgreSQL database with pgvector for semantic search. The platform supports multi-programme education delivery, secure enrollment management, and real-time payment tracking.",
    badges: [
      { name: "Flagship Project" },
      { name: "350+ Active Students" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "RAG / LangChain" },
      { name: "Stripe Integration" },
      { name: "PostgreSQL" },
      { name: "Full-Stack Development" },
    ],
    link: "https://sapiensnova.com",
    github: "#",
    carousel: [
      { image: "/projects/sapiens-nova-1.svg" },
      { image: "/projects/sapiens-nova-2.svg" },
      { image: "/projects/sapiens-nova-3.svg" },
    ],
    featured: true,
    dateRange: "2024",
  },
  {
    name: "HP AI Document Understanding",
    description: "Production RAG pipeline for intelligent document processing",
    stack: "Designed and implemented a Retrieval-Augmented Generation pipeline for enterprise document understanding at Hewlett-Packard. Built with Python, LangChain, Llama models, and Hugging Face embeddings. The system features document ingestion, intelligent chunking, semantic retrieval, and response generation workflows. Containerized using Docker for reproducibility and deployment, with comprehensive evaluation strategies to assess model accuracy and grounding.",
    badges: [
      { name: "HP Internship Project" },
      { name: "Python" },
      { name: "LangChain" },
      { name: "Docker" },
      { name: "RAG Pipeline" },
      { name: "Llama Models" },
      { name: "AI/ML Engineering" },
    ],
    link: "#",
    github: "#",
    carousel: [
      { image: "/projects/hp-rag-1.svg" },
      { image: "/projects/hp-rag-2.svg" },
      { image: "/projects/hp-rag-3.svg" },
    ],
    featured: true,
    dateRange: "2024",
  },
  {
    name: "Autonomous Robotics Systems",
    description: "Pick-and-place robot with trajectory planning and automation",
    stack: "Designed and implemented robotics systems including a pick-and-place robot using cubic polynomial trajectory planning, self-balancing and obstacle-avoiding robots, and Bluetooth-controlled systems. Built Arduino-based control systems with comprehensive sensor integration. Developed and installed automated water tap systems that reduced water wastage by approximately 30%. Projects combine mathematical modelling, control theory, and real-time embedded systems.",
    badges: [
      { name: "Robotics Engineering" },
      { name: "Arduino" },
      { name: "C++" },
      { name: "Trajectory Planning" },
      { name: "Sensor Integration" },
      { name: "Control Systems" },
      { name: "Automation" },
    ],
    link: "#",
    github: "#",
    carousel: [
      { image: "/projects/robotics-1.svg" },
      { image: "/projects/robotics-2.svg" },
      { image: "/projects/robotics-3.svg" },
    ],
    featured: true,
    dateRange: "2023-2024",
  },
  {
    name: "ML Computer Vision Systems",
    description: "CNN-based image processing and neural texture synthesis",
    stack: "Implemented advanced machine learning systems for visual computing, including CNN-based image denoising using PyTorch, neural texture synthesis using Gram matrices, and object detection and segmentation pipelines. Applied advanced image processing techniques in MATLAB and PyTorch, combining theoretical understanding of convolutional architectures with practical implementation for real-world visual tasks.",
    badges: [
      { name: "Machine Learning" },
      { name: "PyTorch" },
      { name: "Computer Vision" },
      { name: "CNN" },
      { name: "MATLAB" },
      { name: "Research" },
      { name: "Python" },
    ],
    link: "#",
    github: "#",
    carousel: [
      { image: "/projects/ml-vision-1.svg" },
      { image: "/projects/ml-vision-2.svg" },
      { image: "/projects/ml-vision-3.svg" },
    ],
    featured: true,
    dateRange: "2023",
  },
];

export const skills = {
  "Programming Languages": [
    "Python",
    "JavaScript / TypeScript",
    "Java",
    "C / C++",
    "SQL",
    "Haskell",
    "MIPS Assembly",
  ],
  "AI & Machine Learning": [
    "Large Language Models (LLMs)",
    "Retrieval-Augmented Generation (RAG)",
    "LangChain",
    "PyTorch",
    "TensorFlow",
    "Computer Vision",
    "Neural Networks",
    "Embeddings & Vector Databases",
    "Hugging Face",
  ],
  "Frameworks & Tools": [
    "Next.js",
    "React",
    "Astro",
    "Spring Boot",
    "Node.js",
    "Docker",
    "Git",
    "PostgreSQL",
    "REST APIs",
    "Stripe API",
    "Tailwind CSS",
  ],
  "Robotics & Embedded": [
    "Arduino",
    "ESP32",
    "ROS (Robot Operating System)",
    "Control Systems",
    "Trajectory Planning",
    "Sensor Integration",
    "Real-Time Systems",
  ],
};

export interface Experience {
  role: string;
  company: string;
  location: string;
  dateRange: string;
  description: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    role: "AI Systems Engineering Intern",
    company: "Hewlett-Packard (HP)",
    location: "United Kingdom",
    dateRange: "Summer 2024",
    description: [
      "Designed and implemented a production-grade Retrieval-Augmented Generation (RAG) pipeline for enterprise document understanding and intelligent query processing",
      "Built end-to-end ML system using LangChain, Llama models, and Hugging Face embeddings with containerized deployment using Docker",
      "Developed comprehensive evaluation frameworks to assess model accuracy, response grounding, and system reliability",
      "Collaborated with engineering teams on architecture design, deployment strategies, and scalability considerations",
    ],
    technologies: ["Python", "LangChain", "Docker", "RAG", "Llama Models", "Hugging Face"],
  },
  {
    role: "Full-Stack Developer & AI Engineer",
    company: "Sapiens Nova Academy",
    location: "Remote",
    dateRange: "2023 - Present",
    description: [
      "Led full-stack development and AI integration for global EdTech platform serving 350+ students across international programmes",
      "Built complete platform architecture including multi-programme education delivery, secure enrollment management, and real-time payment tracking",
      "Implemented AI-powered learning assistant using Retrieval-Augmented Generation (RAG) with LangChain and PostgreSQL vector search",
      "Integrated Stripe payment processing with webhook-driven state management for enrollment and payment workflows",
      "Developed 70+ reusable UI components with Astro, React, TypeScript, and Tailwind CSS featuring dark mode and accessibility-conscious design",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "RAG", "LangChain", "React"],
  },
  {
    role: "Full-Stack Developer Intern",
    company: "Real Estate Platform",
    location: "Remote",
    dateRange: "2023",
    description: [
      "Built high-performance real estate platform achieving sub-2-second load times through optimization",
      "Developed dynamic filtering systems, animations, and lead-generation workflows",
      "Focused on scalability, user experience, and production readiness",
    ],
    technologies: ["React", "Node.js", "TypeScript", "REST APIs"],
  },
];

export const research = {
  interests: [
    {
      title: "Applied Machine Learning & AI Systems",
      description: "Exploring how LLMs, RAG systems, and intelligent agents can be responsibly integrated into production systems that deliver real value to users",
      icon: "brain",
    },
    {
      title: "Retrieval-Augmented Generation",
      description: "Investigating architectures and techniques for grounding language models with external knowledge, improving accuracy and reducing hallucinations",
      icon: "database",
    },
    {
      title: "Robotics-Integrated Intelligence",
      description: "Combining control theory, trajectory planning, and machine learning to create autonomous systems that interact intelligently with the physical world",
      icon: "robot",
    },
    {
      title: "Computer Vision & Visual Computing",
      description: "Applying neural networks and advanced image processing to solve real-world visual understanding tasks",
      icon: "eye",
    },
  ],
  statement: "My research interests center on bridging theoretical machine learning concepts with practical, deployable systems. I am particularly interested in research that translates into usable tools, and I aim to pursue roles that combine engineering depth with research exploration, with long-term interest in PhD study.",
};

export const leadership = [
  {
    role: "Programming Mentor",
    organization: "University College London",
    description: "Mentoring first-year Computer Science students in programming fundamentals, project development, and software engineering best practices",
  },
  {
    role: "UCL Accelerate Tutor",
    organization: "UCL Widening Participation Programme",
    description: "Supporting underrepresented students in accessing higher education and developing technical skills",
  },
  {
    role: "Robotics & Web Development Workshop Leader",
    organization: "Community STEM Education",
    description: "Led hands-on workshops teaching robotics fundamentals and web development to students from diverse backgrounds",
  },
  {
    role: "Head of Robotics & Physics",
    organization: "Inter-School STEM Olympiad",
    description: "Designed and delivered robotics and physics curriculum modules for competitive STEM education programme",
  },
];

export const cta = {
  title: "Let's Build Something Impactful",
  description: "I'm actively seeking internship opportunities, industrial placements, and research collaborations in AI systems, applied machine learning, and robotics. I'm particularly interested in environments that value engineering excellence, research depth, and real-world impact.",
  primaryAction: {
    text: "Get In Touch",
    href: "mailto:syed.ali.abbas@ucl.ac.uk",
  },
  secondaryAction: {
    text: "Download CV",
    href: "/cv.pdf",
  },
};
