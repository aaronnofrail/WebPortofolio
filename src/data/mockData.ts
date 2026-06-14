export interface Bio {
  name: string;
  role: string;
  terminalText: string;
  description: string;
  philosophy: string[];
  skills: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  period: string;
  responsibilities: string[];
  tags: string[];
  status?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  status: "Active" | "Completed" | "Archived" | "In Progress";
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

export const mockBio: Bio = {
  name: "aaronnofrail",
  role: "Computer Science Specialist",
  terminalText: "> aaronnofrail",
  description: `Computer Science geek passionate about engineering secure and scalable digital solutions. My technical expertise spans backend architecture, cybersecurity, data science, game development, and the Internet of Things (IoT).

I don't just write code; I build resilient systems. My focus lies in crafting robust backend infrastructure, uncovering security vulnerabilities, and extracting actionable insights from data, alongside exploring game mechanics and smart hardware integration.

I combine technical precision with a proactive mindset. Whether I am securing a network, optimizing APIs, developing interactive game logic, or tinkering with IoT sensors, my goal remains consistent: to deliver high-quality, efficient, and innovative solutions that solve real-world problems.`,
  philosophy: [
    "I build software with a focus on tactile digitalism—interfaces that feel substantial, responsive, and stripped of unnecessary ornament. My approach marries mid-century editorial rigorousness with the raw efficiency of early computing environments.",
    "Every line of code should serve a purpose. I believe in minimalism not as a stylistic choice, but as an engineering principle. By constraining the palette and avoiding modern visual fluff like shadows and blurs, I aim to deliver clarity and performance to the end user."
  ],
  skills: ["React", "TypeScript", "Node.js", "Go"]
};

export const mockExperiences: Experience[] = [
  {
    id: "exp_1",
    jobTitle: "Senior Systems Engineer",
    company: "Nexus_Core",
    period: "2021 — PRESENT",
    status: "ACTIVE_ENTRY [01]",
    responsibilities: [
      "Architected high-availability microservices serving 2M+ daily requests using Go and Kubernetes.",
      "Reduced latency by 40% through aggressive caching strategies and query optimization in PostgreSQL.",
      "Mentored a team of 4 junior developers, establishing strict CI/CD protocols and code review standards."
    ],
    tags: ["Go", "Kubernetes", "PostgreSQL", "Redis"]
  },
  {
    id: "exp_2",
    jobTitle: "Full Stack Developer",
    company: "Cloud_Sync",
    period: "2018 — 2021",
    status: "ARCHIVED_ENTRY [02]",
    responsibilities: [
      "Developed interactive real-time dashboards utilizing React and WebSockets for enterprise clients.",
      "Migrated legacy monolithic PHP application to a scalable Node.js backend.",
      "Implemented automated testing pipelines, increasing test coverage from 20% to 85%."
    ],
    tags: ["React", "Node.js", "TypeScript", "Docker"]
  },
  {
    id: "exp_3",
    jobTitle: "Junior Dev",
    company: "Startup_Alpha",
    period: "2016 — 2018",
    status: "ARCHIVED_ENTRY [03]",
    responsibilities: [
      "Built responsive landing pages and marketing sites using semantic HTML, CSS, and vanilla JS.",
      "Assisted in integrating third-party APIs for payment processing and email campaigns.",
      "Maintained and updated internal administrative tools."
    ],
    tags: ["HTML/CSS", "JavaScript", "PHP"]
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: "ach_1",
    title: "AWS_SOLUTIONS_ARCHITECT",
    description: "Professional certification for designing distributed applications on the AWS platform.",
    image: "/assets/ach_aws.png",
    tags: ["CLOUD", "INFRASTRUCTURE", "VERIFIED"]
  },
  {
    id: "ach_2",
    title: "GLOBAL_HACKATHON_WINNER",
    description: "Rank: 01. Designed and engineered a lightweight, brutalist CSS framework mimicking mid-century computing interfaces.",
    image: "/assets/ach_hackathon.png",
    tags: ["UI/UX", "FRONTEND", "2023"]
  },
  {
    id: "ach_3",
    title: "OPEN_SOURCE_SEMINAR",
    description: "Seminar and knowledge sharing on high-performance networking libraries and core contributions within the global Go community.",
    image: "/assets/ach_seminar.png",
    tags: ["GOLANG", "OPEN SOURCE", "COMMUNITY"]
  },
  {
    id: "ach_4",
    title: "OPEN_SOURCE_CONTRIBUTOR_VETERAN",
    description: "5+ years of active maintenance for critical library dependencies in the Python ecosystem.",
    image: "/assets/ach_contributor.png",
    tags: ["COMMUNITY", "PYTHON"]
  }
];

export const mockProjects: Project[] = [
  {
    id: "proj_1",
    title: "NEXUS_CORE",
    description: "A high-throughput message broker designed for distributed microservices. Implements custom binary protocols over TCP for sub-millisecond latency. Replaces legacy RabbitMQ infrastructure.",
    image: "/assets/c155164454a84dd6b1810e1e9cf79454.png",
    tags: ["Rust", "Redis", "gRPC"],
    githubUrl: "https://github.com/aaronnofrail/nexus-core",
    demoUrl: "#",
    status: "Active"
  },
  {
    id: "proj_2",
    title: "TERMINAL_UI",
    description: "A brutalist, keyboard-first React component library simulating vintage terminal interfaces. Focused on accessibility, strict grid systems, and zero-runtime CSS-in-JS.",
    image: "/assets/3feef40f9ad84a9798bb3d3bdbcce6cc.png",
    tags: ["React", "CSS", "NPM"],
    githubUrl: "https://github.com/aaronnofrail/terminal-ui",
    demoUrl: "#",
    status: "Completed"
  },
  {
    id: "proj_3",
    title: "OMEGA_PROTOCOL",
    description: "Experimental decentralized identity verification system using zero-knowledge proofs. Built during the 2022 Winter Hackathon.",
    image: "/assets/defca9ce59df46a9b6c40796bbbc32d2.png",
    tags: ["Solidity", "Go", "Cryptography"],
    githubUrl: "https://github.com/aaronnofrail/omega-protocol",
    demoUrl: "#",
    status: "Archived"
  },
  {
    id: "proj_4",
    title: "VOID_MAPPER",
    description: "CLI tool for visualizing directory structures and memory allocation using ASCII art generation. Useful for debugging deep file trees.",
    image: "/assets/6b47f221e93f49b083858524f7b8791f.png",
    tags: ["Python", "Bash", "CLI"],
    githubUrl: "https://github.com/aaronnofrail/void-mapper",
    demoUrl: "#",
    status: "In Progress"
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: "faq_1",
    question: "What is your primary tech stack?",
    answer: "My core stack revolves around the React ecosystem (Next.js, Remix), TypeScript for type safety, and Tailwind CSS for rapid, token-based styling. I'm also proficient in Node.js for mid-tier aggregation and tooling."
  },
  {
    id: "faq_2",
    question: "Do you take on freelance projects?",
    answer: "Currently, I am focused on full-time roles, but I occasionally accept small-to-medium contracts if the project aligns with my aesthetic (minimalist, structural design) and technical interests."
  },
  {
    id: "faq_3",
    question: "What is your approach to design systems?",
    answer: "I advocate for strict tokenization. Design systems should be treated like engineering dependencies. A component's margin, color, and typography should derive entirely from a centralized JSON/config file to prevent technical and visual debt."
  },
  {
    id: "faq_4",
    question: "Why the terminal aesthetic?",
    answer: "It minimizes distraction. By relying on pure typography, 1px borders, and high contrast, information density can be maximized without overwhelming the user. It's a return to functionalism."
  }
];

// Memory database for admin messaging/inbox
export const mockMessages: InboxMessage[] = [
  {
    id: "msg_1",
    name: "client_004@proton.me",
    email: "client_004@proton.me",
    subject: "Inbound secure transmission request",
    message: "We need an engineer to assist with setting up our gRPC logging nodes. Can you review our architecture document?",
    receivedAt: "2023-10-24 11:20:15"
  },
  {
    id: "msg_2",
    name: "hr@nex_corp.com",
    email: "hr@nex_corp.com",
    subject: "Interview Invitation: System Architect Role",
    message: "Your application at Nexus_Core has passed the initial kernel check. Let's schedule a call next week.",
    receivedAt: "2023-10-24 08:15:30"
  }
];
