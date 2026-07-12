import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/* ---------- Typewriter ---------- */
function Typewriter({
  words,
  className = "",
  typeMs = 70,
  eraseMs = 40,
  holdMs = 1400,
}: {
  words: string[];
  className?: string;
  typeMs?: number;
  eraseMs?: number;
  holdMs?: number;
}) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [erasing, setErasing] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduced.current) {
      setText(words[i]);
      return;
    }
    const target = words[i];
    if (!erasing && text === target) {
      const t = setTimeout(() => setErasing(true), holdMs);
      return () => clearTimeout(t);
    }
    if (erasing && text === "") {
      setErasing(false);
      setI((v) => (v + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => {
        setText(
          erasing ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1)
        );
      },
      erasing ? eraseMs : typeMs
    );
    return () => clearTimeout(t);
  }, [text, erasing, i, words, typeMs, eraseMs, holdMs]);

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block w-[0.55ch] animate-pulse text-gray-400">|</span>
    </span>
  );
}

/* ---------- Certification card stack ---------- */
type Cert = { t: string; o: string; note?: string; featured?: boolean };

function CertStack({ items }: { items: Cert[] }) {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const advance = (dir: 1 | -1 = 1) => {
    if (leaving !== null) return;
    setLeaving(i);
    window.setTimeout(() => {
      setI((v) => (v + dir + items.length) % items.length);
      setLeaving(null);
    }, 420);
  };

  useEffect(() => {
    if (paused) return;
    timer.current = window.setTimeout(() => advance(1), 4200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [i, paused, leaving]);

  return (
    <div
      className="mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[240px] sm:h-[220px]">
        {items.map((c, idx) => {
          const rel = (idx - i + items.length) % items.length;
          const isLeaving = leaving === idx;
          const visible = rel < 3;

          let style: React.CSSProperties;
          if (isLeaving) {
            style = {
              transform: "translate3d(120%, -8px, 0) rotate(5deg)",
              opacity: 0,
              zIndex: 60,
            };
          } else if (visible) {
            style = {
              transform: `translate3d(0, ${rel * 10}px, 0) scale(${1 - rel * 0.04})`,
              opacity: rel === 0 ? 1 : rel === 1 ? 0.75 : 0.45,
              zIndex: 50 - rel,
              pointerEvents: rel === 0 ? "auto" : "none",
            };
          } else {
            style = {
              transform: "translate3d(0, 30px, 0) scale(0.88)",
              opacity: 0,
              zIndex: 0,
              pointerEvents: "none",
            };
          }

          return (
            <article
              key={c.t}
              style={{
                ...style,
                transition:
                  "transform 420ms cubic-bezier(0.16,1,0.3,1), opacity 350ms ease",
              }}
              className="card-soft absolute inset-x-0 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="label-mono">{c.o.split(" — ")[0].split(" (")[0]}</p>
                {c.featured ? (
                  <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-background">
                    licensed
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-[17px] font-medium leading-snug text-ink">
                {c.t}
              </h3>
              <p className="mt-2 text-[13px] text-gray-500">{c.o}</p>
              {c.note && <p className="mt-1 text-[12px] text-gray-500">{c.note}</p>}
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                ‹ verify ›
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="label-mono">
          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => advance(-1)}
            className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:bg-gray-50"
            aria-label="Previous certification"
          >
            ← prev
          </button>
          <button
            onClick={() => advance(1)}
            className="rounded-md bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background transition-opacity hover:opacity-90"
            aria-label="Next certification"
          >
            next →
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Portfolio,
});

const NAV = [
  { id: "about", label: "about", num: "01" },
  { id: "licenses", label: "licenses", num: "02" },
  { id: "experience", label: "experience", num: "03" },
  { id: "research", label: "research", num: "04" },
  { id: "publications", label: "publications", num: "05" },
  { id: "affiliations", label: "affiliations", num: "06" },
  { id: "education", label: "education", num: "07" },
  { id: "gallery", label: "gallery", num: "08" },
  { id: "contact", label: "contact", num: "09" },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as
      | "light"
      | "dark"
      | "system"
      | null;
    if (stored) setTheme(stored);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply();
    if (typeof localStorage !== "undefined") localStorage.setItem("theme", theme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);
  return { theme, setTheme };
}

function Sidebar({ active }: { active: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-56 flex-col justify-between border-r border-gray-200 bg-background px-6 py-8 lg:flex">
      <div>
        <a href="#top" className="flex items-center gap-2">
          <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
          <span className="font-mono text-[13px] text-ink">justine.lauredo</span>
        </a>
        <p className="mt-1 pl-3.5 font-mono text-[10px] uppercase tracking-widest text-gray-400">
          /ece × ai
        </p>

        <nav className="mt-10 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group flex items-baseline gap-3 py-1.5 font-mono text-[12px] transition-colors ${
                  isActive ? "text-ink" : "text-gray-500 hover:text-ink"
                }`}
              >
                <span className="w-4 text-[10px] uppercase tracking-widest text-gray-400">
                  {isActive ? "→" : item.num}
                </span>
                <span className="lowercase">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="label-mono">theme</p>
        <div className="mt-2 flex gap-1 rounded-full border border-gray-200 p-0.5">
          {(["light", "system", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 rounded-full py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                theme === t ? "bg-ink text-background" : "text-gray-500 hover:text-ink"
              }`}
            >
              {t[0]}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <a href="#top" className="flex items-center gap-2">
          <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
          <span className="font-mono text-[13px]">justine.lauredo</span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="font-mono text-[11px] uppercase tracking-widest text-gray-500"
        >
          {open ? "close" : "menu"}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur px-6 py-8 lg:hidden">
          <button
            onClick={() => setOpen(false)}
            className="ml-auto block font-mono text-[11px] uppercase tracking-widest text-gray-500"
          >
            close
          </button>
          <nav className="mt-10 flex flex-col gap-3">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-3 font-mono text-lg text-ink"
              >
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  {item.num}
                </span>
                <span className="lowercase">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-gray-400">
      {num} — {label}
    </p>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">
      {children}
    </span>
  );
}

function InkChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-background">
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card-soft p-5 ${className}`}>{children}</div>;
}

function Portfolio() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Sidebar active={active} />
      <TopBar />

      <main className="lg:ml-56">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
          {/* Hero */}
          <section className="fade-up relative">
            <div className="halftone pointer-events-none absolute -left-8 -top-10 h-40 w-64 opacity-70" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
                researching
              </span>
              <h1 className="mt-6 display-pixel text-4xl lowercase leading-[1.05] text-ink sm:text-5xl">
                engr. justine d. lauredo,{" "}
                <span className="text-gray-500">ect</span>
              </h1>
              <p className="mt-3 font-serif text-xl text-gray-700">
                <Typewriter
                  words={[
                    "AI Researcher",
                    "Electronics Engineer",
                    "IoT Prototyper",
                    "IEEE Author",
                  ]}
                />
              </p>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-gray-500">
                Licensed Electronics Engineer & Technician · IEEE-published researcher.
                Fascinated by the mechanics behind how things work — I use computers to
                transform raw curiosity into functional technology.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <a
                  href="#research"
                  className="rounded-md bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background"
                >
                  view research →
                </a>
                <a
                  href="#contact"
                  className="rounded-md border border-gray-300 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink"
                >
                  contact
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 border border-gray-200 sm:grid-cols-4">
                {[
                  { k: "degree", v: "Magna Cum Laude" },
                  { k: "publications", v: "2 IEEE" },
                  { k: "conferences", v: "PH · MY · TH" },
                  { k: "role", v: "AI Researcher" },
                ].map((s, i) => (
                  <div
                    key={s.k}
                    className={`p-4 ${i > 0 ? "border-t border-gray-200 sm:border-l sm:border-t-0" : ""}`}
                  >
                    <p className="label-mono">{s.k}</p>
                    <p className="mt-1 font-mono text-[13px] text-ink">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About */}
          <section id="about" className="mt-28 fade-up">
            <SectionHeader num="01" label="about" />
            <h2 className="display-pixel text-3xl lowercase text-ink">skills & domains</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
              <p>
                I am a Licensed Electronics Engineer and Electronics Technician working as
                an AI Researcher. My work sits at the intersection of hardware circuits,
                embedded systems, and applied intelligence.
              </p>
              <p>
                I have a growing foundation in Artificial Intelligence, IoT, and
                renewable-energy systems, including machine-learning models and GIS-based
                solar simulations I've presented at IEEE-sponsored international
                conferences in Malaysia and Thailand.
              </p>
              <p>
                I'm comfortable moving between artificial intelligence, software, 3D
                modelling, embedded prototyping, and data analytics — and dedicated to
                refining my engineering expertise through hands-on experience and
                structured mentorship.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {[
                "circuit design",
                "machine learning",
                "robotics",
                "solar / pv",
                "iot · agri-tech",
                "qgis · homer",
                "rf / comms",
                "python · c",
              ].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 border border-gray-200">
              {[
                { v: "2", k: "IEEE publications" },
                { v: "5", k: "Research projects" },
                { v: "4×", k: "Batch salutatorian" },
              ].map((s, i) => (
                <div
                  key={s.k}
                  className={`p-5 ${i > 0 ? "border-l border-gray-200" : ""}`}
                >
                  <p className="display-pixel text-3xl lowercase text-ink">{s.v}</p>
                  <p className="mt-1 label-mono">{s.k}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Licenses */}
          <section id="licenses" className="mt-28 fade-up">
            <SectionHeader num="02" label="licenses & certifications" />
            <h2 className="display-pixel text-3xl lowercase text-ink">
              credentials, conferences, coursework
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  t: "Licensed Electronics Engineer (ECE)",
                  o: "Professional Regulation Commission — Philippines",
                  featured: true,
                },
                {
                  t: "Licensed Electronics Technician (ECT)",
                  o: "Professional Regulation Commission — Philippines",
                  featured: true,
                },
                {
                  t: "IEEE ICPEA 2025 — Research Presenter",
                  o: "Universiti Teknologi MARA",
                  note: "5th Intl. Conf. on Power Engineering Applications · Selangor, Malaysia",
                },
                {
                  t: "IBDAP 2025",
                  o: "Big Data Institute (BDI)",
                  note: "6th Intl. Conf. on Big Data Analytics — IEEE · Chiang Mai, Thailand",
                },
                {
                  t: "LBTechX1 — Technology Entrepreneurship",
                  o: "HarvardX (Verified Certificate)",
                },
                {
                  t: "CalcAPL1x — Calculus Applied!",
                  o: "HarvardX (Verified Certificate)",
                },
                {
                  t: "Data Analytics Fundamentals",
                  o: "DataSense Analytics Institute",
                  note: "Professional Training Program",
                },
                {
                  t: "Intro to Quantum Natural Language Processing",
                  o: "Quantum Computing Society of the Philippines (QCSP)",
                },
              ].map((c) => (
                <Card key={c.t}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="label-mono">{c.o.split(" — ")[0].split(" (")[0]}</p>
                    {c.featured && <InkChip>licensed</InkChip>}
                  </div>
                  <h3 className="mt-2 text-[15px] font-medium leading-snug text-ink">
                    {c.t}
                  </h3>
                  <p className="mt-2 text-[13px] text-gray-500">{c.o}</p>
                  {c.note && <p className="mt-1 text-[12px] text-gray-500">{c.note}</p>}
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    ‹ verify ›
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="mt-28 fade-up">
            <SectionHeader num="03" label="experience" />
            <h2 className="display-pixel text-3xl lowercase text-ink">work experience</h2>

            <div className="mt-8 space-y-6 border-l border-gray-200 pl-6">
              {[
                {
                  when: "Jul 2026 — Present",
                  role: "AI Researcher",
                  org: "Gavin Ventures Inc.",
                  bullets: [
                    "Performing data mining across large, heterogeneous datasets to surface patterns that inform product decisions.",
                    "Building and maintaining data pipelines that clean, transform, and structure raw data for analysis.",
                    "Running exploratory analysis and applied ML experiments to extract actionable insights from mined data.",
                    "Translating research findings into reports and data-driven recommendations for cross-functional teams.",
                  ],
                  tags: ["AI Research", "Data Mining", "Machine Learning"],
                },
                {
                  when: "Aug 2024 — Oct 2024",
                  role: "Engineering Intern",
                  org: "Research Institute for Strategic Foresight and Innovation",
                  bullets: [
                    "Developed a smart hydroponics prototype end-to-end.",
                    "Integrated sensors and microcontroller-based monitoring for live plant data.",
                    "Designed the circuit and 3D-modeled the enclosure and mounting hardware.",
                    "Ran testing and debugging cycles to improve system reliability.",
                  ],
                  tags: ["IoT", "Circuit Design", "3D Modeling", "Prototyping"],
                },
              ].map((x) => (
                <div key={x.role} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border border-gray-300 bg-background" />
                  <div className="card-soft p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="label-mono">{x.when}</p>
                      <p className="font-mono text-[11px] text-gray-500">{x.org}</p>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-ink">{x.role}</h3>
                    <ul className="mt-4 space-y-2">
                      {x.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[14px] text-gray-700">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {x.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research */}
          <section id="research" className="mt-28 fade-up">
            <SectionHeader num="04" label="research & projects" />
            <h2 className="display-pixel text-3xl lowercase text-ink">
              research and prototypes
            </h2>
            <p className="mt-4 max-w-xl text-[15px] text-gray-500">
              Building, testing, and continuously refining systems that integrate applied
              artificial intelligence, renewable-energy simulations, IoT infrastructure,
              and embedded hardware.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  tag: "Undergraduate Thesis · AI · IoT",
                  title: "BioGrow AI",
                  desc: "Solar-powered AI & IoT smart aquaponics with plant-health monitoring and nutrient management.",
                  featured: true,
                },
                {
                  tag: "Robotics · Computer Vision",
                  title: "Pepperazzi",
                  desc: "AI-driven robotic arm for precision chili-pepper harvesting using YOLOv8 and an integrated grip-and-cut mechanism.",
                },
                {
                  tag: "Renewable Energy · Simulation",
                  title: "GIS-Based Distributed Solar",
                  desc: "HOMER simulation of distributed rooftop solar for power-crisis mitigation in Occidental Mindoro.",
                },
                {
                  tag: "Embedded Systems · Internship",
                  title: "Smart Hydroponics",
                  desc: "Microcontroller-based hydroponics rig with integrated sensor fusion and custom enclosure.",
                },
                {
                  tag: "Robotics · Embedded Systems",
                  title: "Sumobot",
                  desc: "Autonomous mini-sumo robot with ultrasonic and IR sensor fusion, built ground-up.",
                },
              ].map((p, i) => (
                <div
                  key={p.title}
                  className={`card-soft p-6 ${i === 0 ? "sm:col-span-2" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="label-mono">{p.tag}</p>
                    {p.featured && <InkChip>featured</InkChip>}
                  </div>
                  <h3 className="mt-3 text-xl font-medium text-ink">{p.title}</h3>
                  <p className="mt-2 text-[14px] text-gray-500">{p.desc}</p>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    case study ↗
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Publications */}
          <section id="publications" className="mt-28 fade-up">
            <SectionHeader num="05" label="publications" />
            <h2 className="display-pixel text-3xl lowercase text-ink">
              peer-reviewed, ieee-sponsored proceedings
            </h2>

            <div className="mt-8 space-y-3">
              {[
                {
                  venue: "IEEE ICPEA 2025",
                  date: "14 July 2025 · pp. 152–157",
                  title:
                    "Simulation of GIS-Based Distributed Rooftop Solar PV for Power Crisis Mitigation in Occidental Mindoro Using HOMER",
                  authors:
                    "Lauredo, J. D., Bongalon, J. R. A., Ejanda, M. S. L., Pamittan, M. A. L., & Tubola, O. D.",
                },
                {
                  venue: "IEEE IBDAP 2025",
                  date: "1 Aug 2025 · pp. 1–6",
                  title:
                    "Pepperazzi: An AI-Driven Robotic Arm for Precision Harvesting of Chili Peppers Using an Integrated Grip-And-Cut Mechanism and YOLOv8 Algorithm",
                  authors:
                    "Lauredo, J. D., Damian, A. N. B., De Ramos, L. Z. M., Razonable, K. M. M., Sola, F. G., & Rosales, M. A.",
                },
              ].map((p) => (
                <div key={p.title} className="card-soft p-6">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-ink">
                      {p.venue}
                    </p>
                    <p className="font-mono text-[11px] text-gray-500">{p.date}</p>
                  </div>
                  <h3 className="mt-3 text-[16px] font-medium leading-snug text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] italic text-gray-500">{p.authors}</p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-ink link-underline hover:[&]:link-underline-hover"
                  >
                    view doi ↗
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Affiliations */}
          <section id="affiliations" className="mt-28 fade-up">
            <SectionHeader num="06" label="affiliations" />
            <h2 className="display-pixel text-3xl lowercase text-ink">
              organizations & student leadership
            </h2>

            <div className="mt-8 space-y-6 border-l border-gray-200 pl-6">
              {[
                {
                  org: "PUP-REC",
                  full: "PUP Radio Engineering Circle — Manila Section",
                  span: "2022 — 2024",
                  roles: [
                    { r: "Operations Manager", y: "2023 — 2024" },
                    { r: "Member", y: "2022 — 2025" },
                  ],
                },
                {
                  org: "PUP-ECESS",
                  full: "PUP Electronics Engineering Students' Society",
                  span: "2024 — 2025",
                  roles: [{ r: "Member", y: "2024 — 2025" }],
                },
                {
                  org: "PUP-ADS",
                  full: "PUP Association of DOST Scholars",
                  span: "2023 — 2025",
                  roles: [{ r: "Member", y: "2023 — 2025" }],
                },
              ].map((a) => (
                <div key={a.org} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border border-gray-300 bg-background" />
                  <div className="card-soft p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="label-mono">{a.org}</p>
                      <p className="font-mono text-[11px] text-gray-500">{a.span}</p>
                    </div>
                    <h3 className="mt-2 text-[15px] font-medium text-ink">{a.full}</h3>
                    <ul className="mt-4 space-y-1.5">
                      {a.roles.map((r) => (
                        <li
                          key={r.r + r.y}
                          className="flex items-baseline justify-between border-t border-gray-200 pt-1.5 text-[13px] text-gray-700"
                        >
                          <span>{r.r}</span>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                            {r.y}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section id="education" className="mt-28 fade-up">
            <SectionHeader num="07" label="education" />
            <h2 className="display-pixel text-3xl lowercase text-ink">
              educational background
            </h2>

            <div className="mt-8 space-y-6 border-l border-gray-200 pl-6">
              {[
                {
                  when: "2021 — 2025",
                  school: "Polytechnic University of the Philippines — Manila",
                  degree: "BS Electronics Engineering · Magna Cum Laude",
                  note: "Thesis: BioGrow AI — A Solar-Powered AI and IoT-Enhanced Solution for Smart Aquaponics with Plant Health Monitoring and Nutrient Management.",
                },
                {
                  when: "2019 — 2021",
                  school: "Olivarez College — Parañaque",
                  degree: "Senior High School · STEM",
                  note: "Batch Salutatorian with High Honors.",
                },
                {
                  when: "2015 — 2019",
                  school: "Muntinlupa Business High School — Main",
                  degree: "Junior High School",
                  note: "Batch Salutatorian with High Honors.",
                },
                {
                  when: "2009 — 2015",
                  school: "Buli Elementary School",
                  degree: "Elementary",
                  note: "Batch Salutatorian.",
                },
              ].map((e) => (
                <div key={e.school} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border border-gray-300 bg-background" />
                  <div className="card-soft p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="label-mono">{e.when}</p>
                      <p className="font-mono text-[11px] text-gray-500">{e.degree}</p>
                    </div>
                    <h3 className="mt-2 text-[16px] font-medium text-ink">{e.school}</h3>
                    <p className="mt-2 text-[13px] text-gray-500">{e.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          <section id="gallery" className="mt-28 fade-up">
            <SectionHeader num="08" label="gallery" />
            <h2 className="display-pixel text-3xl lowercase text-ink">
              photos from conferences, work, and certifications
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  tag: "Experience",
                  title: "IEEE ICPEA 2025 — Malaysia",
                  desc: "Research presentation · Selangor, Malaysia",
                },
                {
                  tag: "Experience",
                  title: "IEEE IBDAP 2025 — Thailand",
                  desc: "Big Data Analytics conference · Chiang Mai, Thailand",
                },
                {
                  tag: "Fieldwork",
                  title: "BioGrow AI — Deployment",
                  desc: "Smart aquaponics rig on location.",
                },
                {
                  tag: "Lab",
                  title: "Pepperazzi — Test Bench",
                  desc: "Robotic-arm harvesting trials.",
                },
              ].map((g, i) => (
                <div key={g.title} className="card-soft overflow-hidden">
                  <div className="relative aspect-[4/3] halftone bg-gray-50">
                    <div className="absolute right-3 top-3 rounded-full border border-gray-300 bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                      {String(i + 1).padStart(2, "0")} / 21
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="label-mono">{g.tag}</p>
                    <h3 className="mt-1 text-[15px] font-medium text-ink">{g.title}</h3>
                    <p className="mt-1 text-[13px] text-gray-500">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="mt-28 fade-up">
            <SectionHeader num="09" label="contact" />
            <h2 className="display-pixel text-3xl lowercase leading-tight text-ink">
              let's build something that has to work.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] text-gray-500">
              Open to research collaborations, engineering roles, and applied-AI projects
              across robotics, IoT, and renewable energy. The fastest way to reach me is
              by phone or email.
            </p>

            <div className="mt-8 divide-y divide-gray-200 border border-gray-200">
              {[
                { k: "phone", v: "+63 927 571 9284", href: "tel:+639275719284" },
                {
                  k: "email",
                  v: "justinedlauredo@gmail.com",
                  href: "mailto:justinedlauredo@gmail.com",
                },
                {
                  k: "linkedin",
                  v: "justine-lauredo-ece-ect",
                  href: "https://www.linkedin.com/in/justine-lauredo-ece-ect",
                },
              ].map((c) => (
                <a
                  key={c.k}
                  href={c.href}
                  className="group flex items-center justify-between p-5 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <p className="label-mono">{c.k}</p>
                    <p className="mt-1 text-[15px] text-ink">{c.v}</p>
                  </div>
                  <span className="font-mono text-[13px] text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>

          <footer className="mt-28 border-t border-gray-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
                © {new Date().getFullYear()} · justine d. lauredo
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                designed in silence · bryl-minimal
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
