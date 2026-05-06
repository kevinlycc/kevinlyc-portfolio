export type Section = "overview" | "gallery" | "architecture" | "demo";

export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  tagline?: string;
  role?: string;
  duration?: string;
  team?: string;
  status?: string;
  overview?: string;
  highlights?: string[];
  stack: string[];
  links: { label: string; url: string }[];
  sections: Section[];
  gallery?: string[];
  architecture?: string;
  architectureNotes?: string;
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "underwatch",
    name: "Underwatch",
    category: "Embedded · Edge AI",
    description: "On-device fall detection with 3-stage alert escalation, servo tracking, and physical feedback — fully offline.",
    tagline: "Local Edge AI Fall-Detection Surveillance",
    role: "Embedded Engineer",
    duration: "Jan 2026 — Present",
    team: "4 Engineers",
    status: "In Progress",
    overview:
      "Originally built at IrvineHacks 2026. A local edge AI surveillance system running on the Arduino UNO Q that detects falls in real-time using computer vision and machine learning — all processed on-device with zero cloud dependency. A 3-stage alert escalation (Elder → Family → 911) is paired with physical feedback including servo tracking, buzzer alerts, LED matrix displays, and a dismiss button.",
    highlights: [
      "Real-time fall detection using on-device image classification",
      "3-stage alert escalation: Elder → Family → 911",
      "Servo-driven tracking, buzzer alerts, and LED matrix display",
      "Dismiss button cancels false-positive alerts before escalation",
      "Dual-chip architecture: Qualcomm QRB2210 (MPU) handles vision, STM32U585 (MCU) drives peripherals via RouterBridge IPC",
      "Push notifications via ntfy.sh — fully offline otherwise",
    ],
    stack: [
      "Arduino UNO Q",
      "Qualcomm QRB2210",
      "STM32U585",
      "Edge Impulse",
      "Zephyr RTOS",
      "C++",
      "Python",
      "ntfy.sh",
    ],
    links: [],
    sections: ["overview"],
  },
  {
    slug: "watchdog",
    name: "Watchdog",
    category: "DevOps · AI",
    description: "AI-powered CI/CD automation for PR reviews, linting, and security checks.",
    stack: ["Python", "FastAPI", "Node.js", "GitHub Actions", "OpenAI", "AWS"],
    links: [
      { label: "GitHub", url: "https://github.com/itsgeorgema/watchdog" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=SPpE-DwsTb8" },
    ],
    sections: ["overview", "demo"],
    demoUrl: "https://www.youtube.com/embed/SPpE-DwsTb8",
  },
  {
  slug: "fitform",
  name: "FitForm",
  category: "Mobile · Edge AI",
  description: "Fully offline AI coaching app delivering real-time form feedback for squats and basketball jump shots. Runs Google LiteRT and MoveNet Lightning on the Snapdragon 8 Elite's Hexagon NPU at 30fps, overlaying a color-coded skeleton — green for correct form, red for issues. Tracks rep count, per-rep scores, and coaching cues. Sessions are recorded and saved for replay with skeleton overlay synced to video. No cloud. No internet. No subscription.",
  stack: ["Google LiteRT", "MoveNet Lightning", "Snapdragon 8 Elite", "Hexagon NPU", "Android"],
  links: [],
  sections: ["overview"],
},
  {
    slug: "pokemon-generator",
    name: "Pokemon Generator",
    category: "Deep Learning",
    description: "Generates original Pokemon images and stats via a Conditional GAN.",
    stack: ["Python", "PyTorch", "CUDA", "Flask", "Docker"],
    links: [
      { label: "Live", url: "https://original-pokemon-generator-project.fly.dev/" },
      { label: "GitHub", url: "https://github.com/itsgeorgema/Pokemon-Generator" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=SFcy8QjVgsY" },
    ],
    sections: ["overview", "demo"],
    demoUrl: "https://www.youtube.com/embed/SFcy8QjVgsY",
  },
  {
    slug: "spotify-mood-player",
    name: "Spotify Mood Player",
    category: "Full-Stack AI",
    description: "AI categorizes and plays Spotify songs by mood.",
    stack: ["TypeScript", "React", "Python", "Flask", "OpenAI", "AWS"],
    links: [
      { label: "Live", url: "https://spotify-mood-player.vercel.app/" },
      { label: "GitHub", url: "https://github.com/itsgeorgema/spotify-mood-player" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=Iloqfjgzkps" },
    ],
    sections: ["overview", "demo"],
    demoUrl: "https://www.youtube.com/embed/Iloqfjgzkps",
  },
  {
    slug: "text-based-adventure",
    name: "Text-Based Adventure",
    category: "CLI Game",
    description: "Museum heist adventure game inspired by Zork, playable via CLI.",
    stack: ["Java"],
    links: [
      { label: "GitHub", url: "https://github.com/itsgeorgema/text-based-adventure-game" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=PNoRD2KLa6k" },
    ],
    sections: ["overview", "demo"],
    demoUrl: "https://www.youtube.com/embed/PNoRD2KLa6k",
  },
  {
    slug: "esc-website",
    name: "Official Engineering Student Council Website",
    category: "Full-Stack",
    description: "Team website for ESC",
    stack: ["Next.js", "React", "TypeScript", "Supabase"],
    links: [
      { label: "Live", url: "https://akpsiatucsd.com/" },
      { label: "GitHub", url: "https://github.com/itsgeorgema/ucsd-akpsi-website" },
    ],
    sections: ["overview"],
  },
  {
    slug: "portfolio",
    name: "This Portfolio",
    category: "Portfolio",
    description: "Built with Next.js, Three.js, Lenis, GSAP, and WebGL.",
    stack: ["Next.js", "React", "Three.js", "Lenis", "GSAP", "WebGL", "TypeScript"],
    links: [
      { label: "Live", url: "https://kevinlyc.github.io/" },
      { label: "GitHub", url: "https://github.com/kevinlycc/kevinlyc.github.io" },
    ],
    sections: ["overview"],
  },
  {
    slug: "nba-draft-hub",
    name: "NBA Draft Hub",
    category: "Data Dashboard",
    description: "Stats and data explorer for the 2025 NBA Draft class.",
    stack: ["React", "TypeScript", "Vite", "Tailwind"],
    links: [
      { label: "Live", url: "https://nba-draft-hub-six.vercel.app/" },
      { label: "GitHub", url: "https://github.com/itsgeorgema/nba-draft-hub" },
    ],
    sections: ["overview"],
  },
];
