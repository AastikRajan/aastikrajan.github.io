export type Stat = { value: string; label: string };

export type Chapter = {
  id: string;
  kicker: string; // small mono label, e.g. "CHAPTER 01 — THE SKY"
  title: string;
  story: string; // the narrative line
  method: string; // how it was done (research-lab flow)
  stats: Stat[];
  links: { label: string; href: string }[];
  tech: string[];
  morph: string; // shape key for the particle field
  accent?: "cyan" | "violet";
};

export const chapters: Chapter[] = [
  {
    id: "cosmos",
    kicker: "CHAPTER 01 — THE SKY",
    title: "A planet's shadow in 144,000 light curves",
    story:
      "NASA's TESS telescope stares at the sky and streams back noise — stellar flicker, instrument drift, cosmic junk. Somewhere in it, a star dims by a fraction of a percent: a planet passing in front. COSMOS hunts that dip.",
    method:
      "An end-to-end detection pipeline on consumer hardware: 15 orthogonal detectors — classical Box-Least-Squares transit search, the MOMENT time-series foundation model, and dedicated channels for single transits, exocomets and microlensing — swept across the TESS survey. Honest verdict included: candidates reported as candidates, nulls as nulls.",
    stats: [
      { value: "144k", label: "TESS light curves surveyed" },
      { value: "15", label: "orthogonal detectors" },
      { value: "63.9%", label: "known-planet recovery (ensemble)" },
    ],
    links: [],
    tech: ["Python", "BLS", "MOMENT / Chronos", "GPU pipeline"],
    morph: "starfield",
    accent: "cyan",
  },
  {
    id: "pulseguard",
    kicker: "CHAPTER 02 — THE BODY",
    title: "The crash, 4½ minutes before it happens",
    story:
      "In an operating room, vital signs whisper before they scream. PulseGuard listens to the whisper — an early-warning system that flags intraoperative deterioration minutes before it becomes a crisis, without drowning clinicians in false alarms.",
    method:
      "Trained on VitalDB (5,170 real anesthesia cases, Seoul National University Hospital), externally validated on MOVER (UC Irvine) — two hospitals, two continents. Gradient-boosted models over routine monitor channels with conformal calibration; evaluated on a locked held-out test of 303,909 windows. Plus a live monitor streaming a FHIR feed with a calibrated 10-minute forecast cone.",
    stats: [
      { value: "~4.5 min", label: "warning lead time" },
      { value: "308×", label: "fewer false alarms" },
      { value: "0.849", label: "AUROC, locked test" },
      { value: "2", label: "hospitals, cross-validated" },
    ],
    links: [
      { label: "Live monitor", href: "https://aastikrajan.github.io/pulseguard/" },
      { label: "Code", href: "https://github.com/AastikRajan/pulseguard" },
    ],
    tech: ["Python", "XGBoost", "Conformal prediction", "VitalDB · MOVER", "FHIR"],
    morph: "waveform",
    accent: "cyan",
  },
  {
    id: "cosmoscope",
    kicker: "CHAPTER 03 — THE LITERATURE",
    title: "23,954 papers. The gaps glow.",
    story:
      "Science has white space — pairs of ideas that are obviously related, that almost nobody studies together. You can't see it reading one paper at a time. CosmoScope maps an entire field from above and makes the gaps visible.",
    method:
      "Four years of arXiv cosmology and instrumentation papers embedded with sentence-transformers, clustered with BERTopic into ~39 recognizable topics. A white-space engine compares semantic proximity against actual co-citation — where proximity far exceeds co-occurrence, that's a research gap, proposed with real papers cited on each side.",
    stats: [
      { value: "23,954", label: "arXiv papers mapped" },
      { value: "39", label: "discovered topics" },
      { value: "8.6×", label: "PTA attention surge, detected" },
    ],
    links: [
      { label: "Live dashboard", href: "https://aastikrajan.github.io/cosmoscope/" },
      { label: "Code", href: "https://github.com/AastikRajan/cosmoscope" },
    ],
    tech: ["Python", "sentence-transformers", "BERTopic", "UMAP · HDBSCAN", "Plotly"],
    morph: "islands",
    accent: "violet",
  },
  {
    id: "agents",
    kicker: "CHAPTER 04 — THE MIND",
    title: "Machines that check their own work",
    story:
      "A language model alone will confidently invent a number. So I build systems where models police each other — one plans, one works, one judges — and none is trusted alone.",
    method:
      "Cash Flow Runway Advisor: a Planner→Executor→Judge loop with hard guardrails (iteration, token, wall-clock caps) and full trace telemetry, streaming over FastAPI. Small Action Model: Qwen2.5-3B fine-tuned with QLoRA for tool-calling, evaluated BFCL-style on decision accuracy and hallucination rate.",
    stats: [
      { value: "3", label: "roles: plan · execute · judge" },
      { value: "3B", label: "params, fine-tuned tool-caller" },
    ],
    links: [
      { label: "Cashflow advisor", href: "https://github.com/AastikRajan/cashflow-runway-advisor" },
    ],
    tech: ["Claude (Sonnet + Haiku)", "FastAPI", "QLoRA / PEFT", "PyTorch"],
    morph: "lattice",
    accent: "violet",
  },
];

export type PathStop = {
  year: string;
  place: string;
  what: string;
};

export const path: PathStop[] = [
  {
    year: "2022",
    place: "ISRO — Indian Space Research Organisation",
    what: "Research internship: satellite Earth-observation pipelines over the Bay of Bengal & Arabian Sea.",
  },
  {
    year: "2025",
    place: "Springer Nature",
    what: "Co-authored book chapter: Remote Sensing Observation of Sea-Surface Parameters — born from the ISRO work.",
  },
  {
    year: "2019–24",
    place: "Shubhlaxmi Enterprises",
    what: "Scaled a family distribution business 150% with Python automation; cut 10 hrs/week of manual reporting.",
  },
  {
    year: "2026",
    place: "Johns Hopkins University",
    what: "MS in Business Analytics & AI — building the research lab you're scrolling through.",
  },
];

export const play = [
  {
    title: "Vortex Drop",
    what: "One-touch neon 3D arcade drop — spin the tower, thread the ball, chain fever combos.",
    href: "https://aastikrajan.github.io/vortex-drop/",
    tech: "Three.js · TypeScript",
  },
  {
    title: "Lantern",
    what: "Physics puzzle-platformer — protect the balloon with momentum, not clicks.",
    href: "https://aastikrajan.github.io/lantern-balloon-game/",
    tech: "Three.js · Rapier2D",
  },
  {
    title: "Daily Puzzles",
    what: "Five deterministic daily logic puzzles as an offline-first PWA.",
    href: "https://aastikrajan.github.io/daily-puzzles/",
    tech: "React · TypeScript · Vite",
  },
];

export const dossier = [
  {
    title: "COSMOS-SBI",
    what: "Dark-energy & structure-growth engine: neural simulation-based inference (SNPE + Masked Autoregressive Flows) on real survey data — ACT DR6, KiDS, DESI, Pantheon+.",
    tech: "PyTorch · JAX",
  },
  {
    title: "Small Action Model",
    what: "Qwen2.5-3B tool-calling LLM, QLoRA fine-tune, custom MCP tool interface, BFCL-style eval.",
    tech: "PyTorch · PEFT",
  },
  {
    title: "SignalGap",
    what: "Do time-series foundation models fail on irregular astronomical data? Benchmark + GP adapter: TimesFM+GP hits MASE 0.52–0.75, ~7× over raw.",
    tech: "Chronos · Moirai · TimesFM · celerite2",
  },
];
