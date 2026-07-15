import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import portraitAsset from "@/assets/portrait.jpg.asset.json";
import pupRecAsset from "@/assets/pup-rec.png.asset.json";
import pupEcessAsset from "@/assets/pup-ecess.png.asset.json";
import pupAdsAsset from "@/assets/pup-ads.png.asset.json";
import prcAsset from "@/assets/prc.webp.asset.json";
import utmAsset from "@/assets/utm.webp.asset.json";
import bdiAsset from "@/assets/bdi.webp.asset.json";
import harvardAsset from "@/assets/harvard.png.asset.json";
import datasenseAsset from "@/assets/datasense.webp.asset.json";
import qcspAsset from "@/assets/qcsp.webp.asset.json";

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

/* ---------- Certification scattered grid (bryl-minimal style) ---------- */
type CertCard = {
  title: string;
  issuer: string;
  note?: string;
  href: string;
  logo: string;
};
type CertGroup = { label: string; items: CertCard[] };

const VerifySwirl = () => (
  <svg viewBox="0 0 13 22" fill="currentColor" aria-hidden="true" className="h-[14px] w-auto shrink-0">
    <path d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z" transform="translate(8 5) rotate(46)" />
    <path d="M0 -4.3C2.3 -2.8 2.3 2.8 0 4.3C-2.3 2.8 -2.3 -2.8 0 -4.3Z" transform="translate(4.6 11) rotate(14)" />
    <path d="M0 -4C2.1 -2.6 2.1 2.6 0 4C-2.1 2.6 -2.1 -2.6 0 -4Z" transform="translate(8 17) rotate(-30)" />
  </svg>
);

function CertGrid({ groups }: { groups: CertGroup[] }) {
  const rots: Array<{ rot: string; ty: string }> = [
    { rot: "-2deg", ty: "3px" },
    { rot: "1.5deg", ty: "-2px" },
    { rot: "-1deg", ty: "4px" },
    { rot: "2deg", ty: "-3px" },
    { rot: "-1.8deg", ty: "2px" },
    { rot: "1.2deg", ty: "-1px" },
  ];
  return (
    <div className="mt-8 space-y-10 sm:space-y-14">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 sm:mb-5 sm:text-[11px]">
            {g.label}
          </p>
          <div className="flex flex-wrap justify-center gap-y-2 -m-1.5 sm:justify-start">
            {g.items.map((c, idx) => {
              const v = rots[idx % rots.length];
              return (
                <a
                  key={c.title}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ["--rot" as string]: v.rot, ["--ty" as string]: v.ty }}
                  className="cert-card group relative -m-1.5 flex flex-col items-center rounded-xl bg-gradient-to-b from-gray-50 to-white px-3.5 py-5 text-center dark:from-gray-100 dark:to-gray-50"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[6px] rounded-lg border border-gray-200/80 group-hover:border-gray-300"
                  />
                  <img
                    src={c.logo}
                    alt={`${c.issuer} logo`}
                    className="relative h-9 w-9 rounded-md border border-gray-200 bg-white object-contain p-1"
                  />
                  <h3 className="relative mt-3 text-[13px] font-semibold leading-snug text-ink">
                    {c.title}
                  </h3>
                  <p className="relative mt-1 font-mono text-[9.5px] uppercase tracking-wider text-gray-400">
                    {c.issuer}
                  </p>
                  {c.note && (
                    <p className="relative mt-1 line-clamp-2 text-[10px] leading-snug text-gray-500">
                      {c.note}
                    </p>
                  )}
                  <div className="relative mt-auto flex items-center gap-1.5 pt-3 text-gray-300 group-hover:text-ink">
                    <VerifySwirl />
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-400 group-hover:text-ink">
                      Verify
                    </span>
                    <span className="inline-flex -scale-x-100">
                      <VerifySwirl />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


export const Route = createFileRoute("/")({
  component: Portfolio,
});

const NAV = [
  { id: "about", label: "about", num: "01" },
  { id: "licenses", label: "licenses & certs", num: "02" },
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

function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const { theme, setTheme } = useTheme();
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-56 flex-col justify-between border-r border-gray-200 bg-background/80 px-6 py-8 backdrop-blur lg:flex">
      <div>
        <button onClick={() => onSelect("about")} className="flex items-center gap-2">
          <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
          <span className="font-mono text-[13px] text-ink">justine.lauredo</span>
        </button>
        <p className="mt-1 pl-3.5 font-mono text-[10px] uppercase tracking-widest text-gray-400">
          /ece × ai
        </p>

        <nav className="mt-10 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`group flex items-baseline gap-3 py-1.5 text-left font-mono text-[12px] transition-colors ${
                  isActive ? "text-ink" : "text-gray-500 hover:text-ink"
                }`}
              >
                <span className="w-4 text-[10px] uppercase tracking-widest text-gray-400">
                  {isActive ? "→" : item.num}
                </span>
                <span className="lowercase">{item.label}</span>
              </button>
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

function TopBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <button onClick={() => onSelect("about")} className="flex items-center gap-2">
          <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
          <span className="font-mono text-[13px]">justine.lauredo</span>
        </button>
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
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  setOpen(false);
                }}
                className={`flex items-baseline gap-3 text-left font-mono text-lg ${
                  active === item.id ? "text-ink" : "text-gray-500"
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  {item.num}
                </span>
                <span className="lowercase">{item.label}</span>
              </button>
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

/* ---------- Sections ---------- */

function AboutSection() {
  return (
    <>
      {/* Hero */}
      <section className="fade-up relative">
        <div className="halftone pointer-events-none absolute -left-8 -top-10 h-40 w-64 opacity-70" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-500">
            <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
            researching
          </span>

          <div className="mt-6 flex items-center gap-4 sm:gap-7">
            <h1 className="display-pixel min-w-0 flex-1 whitespace-nowrap text-[clamp(0.95rem,4.6vw,1.9rem)] leading-[1.05] tracking-tight text-ink">
              Engr. Justine Lauredo, <span className="text-gray-500">ECT</span>
            </h1>

          </div>


          <p className="mt-5 font-jetbrains text-lg text-gray-700 sm:text-xl">
            <Typewriter
              words={[
                "AI Researcher",
                "Electronics Engineer",
                "Electronics Technician",
                "IEEE Author",
              ]}
            />
          </p>
          <p className="mt-6 max-w-xl text-justify text-[15px] leading-relaxed text-gray-500">
            Currently focusing on Artificial Intelligence & Machine Learning, and
            fascinated by how things work under the hood. I am always exploring,
            optimizing, and turning complex data into actionable intelligence.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("nav:go", { detail: "research" }))
              }
              className="btn-glow rounded-md bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background hover:btn-glow-hover"
            >
              view research →
            </button>
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("nav:go", { detail: "contact" }))
              }
              className="btn-glow rounded-md border border-gray-300 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink hover:btn-glow-hover"
            >
              contact
            </button>
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
      <section className="mt-16 fade-up">
        <SectionHeader num="01" label="about" />
        <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">skills & domains</h2>

        <div className="mt-6 grid gap-8 sm:grid-cols-[220px_1fr] sm:items-start">
          {/* Creative portrait */}
          <figure className="group relative mx-auto w-full max-w-[220px] sm:mx-0">
            <span aria-hidden="true" className="halftone pointer-events-none absolute -inset-4 -z-10 opacity-60" />
            <span aria-hidden="true" className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 rounded-md border border-ink/70" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rounded-md border border-ink/70" />
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-background shadow-[var(--shadow-card)] transition-transform duration-500 group-hover:-translate-y-1">
              <div className="relative aspect-[4/5]">
                <img
                  src={portraitAsset.url}
                  alt="Portrait of Justine Lauredo"
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
                <span className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-20 halftone" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
              <figcaption className="flex items-center justify-between border-t border-gray-200 px-3 py-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">jdl · 2026</span>
                <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-ink" />
              </figcaption>
            </div>
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 left-1 font-mono text-[9px] uppercase tracking-[0.3em] text-gray-400">
              /portrait — muntinlupa, ph
            </span>
          </figure>

          <div className="space-y-4 text-justify text-[15px] leading-relaxed text-gray-700">
            <p>
              I am a Licensed Electronics Engineer and Electronics Technician working as an
              AI Researcher. My work sits at the intersection of hardware circuits, embedded
              systems, and applied intelligence.
            </p>
            <p>
              I have a growing foundation in Artificial Intelligence, IoT, and
              renewable-energy systems, including machine-learning models and GIS-based
              solar simulations I've presented at IEEE-sponsored international conferences
              in Malaysia and Thailand.
            </p>
            <p>
              I'm comfortable moving between artificial intelligence, software, 3D
              modelling, embedded prototyping, and data analytics — and dedicated to
              refining my engineering expertise through hands-on experience and structured
              mentorship.
            </p>
          </div>

        </div>


        <div className="mt-8 flex flex-wrap gap-1.5">
          {[
            "artificial intelligence",
            "machine learning",
            "circuit design",
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
            <div key={s.k} className={`p-5 ${i > 0 ? "border-l border-gray-200" : ""}`}>
              <p className="display-pixel text-2xl lowercase text-ink sm:text-3xl">{s.v}</p>
              <p className="mt-1 label-mono">{s.k}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function LicensesSection() {
  return (
    <section className="fade-up">
      <SectionHeader num="02" label="licenses & certifications" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">
        <Typewriter words={["credentials", "conferences", "coursework"]} />
      </h2>
      <p className="mt-3 max-w-xl text-justify text-[13px] text-gray-500 sm:text-[14px]">
        Licenses, IEEE conference presentations, and verified coursework — every card
        links to its issuer for verification.
      </p>
      <CertGrid
        groups={[
          {
            label: "Licensure",
            items: [
              {
                title: "Licensed Electronics Engineer (ECE)",
                issuer: "PRC — Philippines",
                logo: prcAsset.url,
                href: "https://www.prcboard.com/eele-results-march-2026-electronics-engineering-licensure-exam-list-of-passers",
              },
              {
                title: "Licensed Electronics Technician (ECT)",
                issuer: "PRC — Philippines",
                logo: prcAsset.url,
                href: "https://www.prcboard.com/etle-results-march-2026-electronics-technician-licensure-exam-list-of-passers",
              },
            ],
          },
          {
            label: "Conferences",
            items: [
              {
                title: "IEEE ICPEA 2025 — Research Presenter",
                issuer: "Universiti Teknologi MARA",
                note: "5th Intl. Conf. on Power Engineering Applications · Selangor, MY",
                logo: utmAsset.url,
                href: "https://drive.google.com/file/d/1kLrObFTL0J4BHw-A5rLcCgLZ09k6cgoz/view?usp=sharing",
              },
              {
                title: "IBDAP 2025",
                issuer: "Big Data Institute (BDI)",
                note: "6th Intl. Conf. on Big Data Analytics · Chiang Mai, TH",
                logo: bdiAsset.url,
                href: "https://drive.google.com/file/d/1kAwH-8RJSuf0ljkFCpRxZF-soMZ7ZWaH/view?usp=sharing",
              },
            ],
          },
          {
            label: "Coursework",
            items: [
              {
                title: "LBTechX1 — Technology Entrepreneurship: Lab to Market",
                issuer: "Harvard University",
                note: "HarvardX · Verified Certificate",
                logo: harvardAsset.url,
                href: "https://courses.edx.org/certificates/b2055fcc49a74683aab10b096758d3e7",
              },
              {
                title: "CalcAPL1x — Calculus Applied!",
                issuer: "Harvard University",
                note: "HarvardX · Verified Certificate",
                logo: harvardAsset.url,
                href: "https://courses.edx.org/certificates/d0fe4a2f31ec4824ba23a3f22cd3ef20",
              },
              {
                title: "Data Analytics Fundamentals",
                issuer: "DataSense Analytics Inc.",
                note: "Professional Training Program",
                logo: datasenseAsset.url,
                href: "https://app.datasenseph.com/credential-validation?credentialId=HNRWTN4K05TBH",
              },
              {
                title: "Intro to Quantum Natural Language Processing",
                issuer: "QCSP",
                note: "Lecture Series",
                logo: qcspAsset.url,
                href: "https://verified.sertifier.com/en/verify/02247570429077/",
              },
            ],
          },
        ]}
      />
    </section>
  );
}

function ExperienceSection() {
  const items = [
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
  ];

  return (
    <section className="fade-up">
      <SectionHeader num="03" label="experience" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">work experience</h2>

      <div className="mt-8 space-y-6 border-l border-gray-200 pl-6">
        {items.map((x, i) => (
          <div
            key={x.role}
            className="group relative tab-enter"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border border-gray-300 bg-background transition-all duration-300 group-hover:scale-125 group-hover:bg-ink" />
            <span className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-ink/0 blur transition-all duration-500 group-hover:bg-ink/20" />
            <div className="card-soft p-6 transition-all duration-300 group-hover:card-soft-hover">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="label-mono">{x.when}</p>
                <p className="font-mono text-[11px] text-gray-500">{x.org}</p>
              </div>
              <h3 className="mt-2 text-lg font-medium text-ink">{x.role}</h3>
              <ul className="mt-4 space-y-2">
                {x.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-justify text-[14px] text-gray-700">
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
  );
}

type Project = {
  tag: string;
  title: string;
  desc: string;
  featured?: boolean;
  details: string;
  stack: string[];
  gallery: { label: string; hint: string }[];
};

const PROJECTS: Project[] = [
  {
    tag: "Undergraduate Thesis · AI · IoT",
    title: "BioGrow AI",
    desc: "Solar-powered AI & IoT smart aquaponics with plant-health monitoring and nutrient management.",
    featured: true,
    details:
      "BioGrow AI is a solar-powered aquaponics platform that couples embedded sensors with a lightweight computer-vision model to monitor plant health and automate nutrient dosing. The system streams live pH, EC, temperature, and water-level telemetry to a dashboard, and flags stress conditions before yield drops.",
    stack: ["Python", "TensorFlow Lite", "ESP32", "Solar PV", "MQTT"],
    gallery: [
      { label: "Deployment rig", hint: "on-site aquaponics prototype" },
      { label: "Vision model", hint: "leaf-health classifier output" },
      { label: "Dashboard", hint: "live telemetry & alerts" },
    ],
  },
  {
    tag: "Robotics · Computer Vision",
    title: "Pepperazzi",
    desc: "AI-driven robotic arm for precision chili-pepper harvesting using YOLOv8 and an integrated grip-and-cut mechanism.",
    details:
      "Pepperazzi is a bench-scale robotic manipulator that detects ripe chili peppers via YOLOv8 and executes a coordinated grip-and-cut action. Published at IEEE IBDAP 2025 (Chiang Mai, Thailand).",
    stack: ["YOLOv8", "Python", "Servo control", "OpenCV"],
    gallery: [
      { label: "Test bench", hint: "arm mid-harvest" },
      { label: "YOLO inference", hint: "ripe-pepper detections" },
    ],
  },
  {
    tag: "Renewable Energy · Simulation",
    title: "GIS-Based Distributed Solar",
    desc: "HOMER simulation of distributed rooftop solar for power-crisis mitigation in Occidental Mindoro.",
    details:
      "A HOMER-driven techno-economic simulation of distributed rooftop PV across selected barangays in Occidental Mindoro, using QGIS for spatial analysis. Presented at IEEE ICPEA 2025 (Selangor, Malaysia).",
    stack: ["HOMER Pro", "QGIS", "Solar PV modelling"],
    gallery: [
      { label: "GIS layer", hint: "rooftop capacity map" },
      { label: "HOMER results", hint: "LCOE & load-match" },
    ],
  },
  {
    tag: "Embedded Systems · Internship",
    title: "Smart Hydroponics",
    desc: "Microcontroller-based hydroponics rig with integrated sensor fusion and custom enclosure.",
    details:
      "An internship prototype built end-to-end: schematic, PCB layout, sensor fusion firmware, and a 3D-printed enclosure engineered for indoor greenhouse deployment.",
    stack: ["Arduino", "Sensor fusion", "Fusion 360", "3D printing"],
    gallery: [
      { label: "Assembly", hint: "sensor stack + reservoir" },
      { label: "Enclosure", hint: "3D-modeled housing" },
    ],
  },
  {
    tag: "Robotics · Embedded Systems",
    title: "Sumobot",
    desc: "Autonomous mini-sumo robot with ultrasonic and IR sensor fusion, built ground-up.",
    details:
      "A ground-up mini-sumo build combining ultrasonic ranging and IR edge detection with a reactive control loop tuned for competition matches.",
    stack: ["C/C++", "Ultrasonic", "IR sensors", "H-bridge"],
    gallery: [
      { label: "Chassis", hint: "drivetrain + sensors" },
      { label: "Match run", hint: "arena test" },
    ],
  },
];

function ResearchSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const active = openIdx !== null ? PROJECTS[openIdx] : null;

  return (
    <section className="fade-up">
      <SectionHeader num="04" label="research & projects" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">
        research and prototypes
      </h2>
      <p className="mt-4 max-w-xl text-justify text-[15px] text-gray-500">
        Building, testing, and continuously refining systems that integrate applied
        artificial intelligence, renewable-energy simulations, IoT infrastructure, and
        embedded hardware.
      </p>

      {/* Tab pills */}
      <div className="mt-8 flex flex-wrap gap-1.5">
        {PROJECTS.map((p, idx) => {
          const isActive = openIdx === idx;
          return (
            <button
              key={p.title}
              onClick={() => setOpenIdx(idx)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                isActive
                  ? "border-ink bg-ink text-background btn-glow-hover"
                  : "border-gray-300 text-gray-500 hover:border-ink hover:text-ink"
              }`}
            >
              {p.title}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div key={active.title} className="tab-enter mt-6 card-soft p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="label-mono">{active.tag}</p>
            {active.featured && <InkChip>featured</InkChip>}
          </div>
          <h3 className="mt-3 text-2xl font-medium text-ink">{active.title}</h3>
          <p className="mt-3 text-justify text-[14px] leading-relaxed text-gray-700">
            {active.details}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {active.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {active.gallery.map((g, i) => (
              <figure
                key={g.label}
                className="tab-enter overflow-hidden rounded-md border border-gray-200"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="halftone relative aspect-[4/3] bg-gray-50">
                  <span className="absolute right-2 top-2 rounded-full border border-gray-300 bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="p-3">
                  <p className="label-mono">{g.label}</p>
                  <p className="mt-1 text-[12px] text-gray-500">{g.hint}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PublicationsSection() {
  const pubs = [
    {
      venue: "IEEE ICPEA 2025",
      date: "14 July 2025 · pp. 152–157",
      title:
        "Simulation of GIS-Based Distributed Rooftop Solar PV for Power Crisis Mitigation in Occidental Mindoro Using HOMER",
      authors:
        "Lauredo, J. D., Bongalon, J. R. A., Ejanda, M. S. L., Pamittan, M. A. L., & Tubola, O. D.",
      href: "https://doi.org/10.1109/ICPEA65460.2025.11146402",
    },
    {
      venue: "IEEE IBDAP 2025",
      date: "1 Aug 2025 · pp. 1–6",
      title:
        "Pepperazzi: An AI-Driven Robotic Arm for Precision Harvesting of Chili Peppers Using an Integrated Grip-And-Cut Mechanism and YOLOv8 Algorithm",
      authors:
        "Lauredo, J. D., Damian, A. N. B., De Ramos, L. Z. M., Razonable, K. M. M., Sola, F. G., & Rosales, M. A.",
      href: "https://doi.org/10.1109/IBDAP65611.2025.11165174",
    },
  ];

  return (
    <section className="fade-up">
      <SectionHeader num="05" label="publications" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">
        peer-reviewed, ieee-sponsored proceedings
      </h2>

      <div className="mt-8 space-y-3">
        {pubs.map((p) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block card-soft p-6 transition-all duration-300 hover:card-soft-hover"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink">
                {p.venue}
              </p>
              <p className="font-mono text-[11px] text-gray-500">{p.date}</p>
            </div>
            <h3 className="mt-3 text-justify text-[16px] font-medium leading-snug text-ink">
              {p.title}
            </h3>
            <p className="mt-2 text-[13px] italic text-gray-500">{p.authors}</p>
            <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-ink link-underline group-hover:[&]:link-underline-hover">
              view doi{" "}
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function AffiliationsSection() {
  const affs = [
    {
      short: "PUP-REC",
      org: "PUP Radio Engineering Circle — Manila Section",
      span: "2022 — 2024",
      roles: [
        { r: "Operations Manager", y: "2023 — 2024" },
        { r: "Member", y: "2022 — 2025" },
      ],
      logo: pupRecAsset.url,
      href: "https://www.facebook.com/PUPREC",
    },
    {
      short: "PUP-ECESS",
      org: "PUP Electronics Engineering Students' Society",
      span: "2024 — 2025",
      roles: [{ r: "Member", y: "2024 — 2025" }],
      logo: pupEcessAsset.url,
      href: "https://www.facebook.com/pup.ecess1979",
    },
    {
      short: "PUP-ADS",
      org: "PUP Association of DOST Scholars",
      span: "2023 — 2025",
      roles: [{ r: "Member", y: "2023 — 2025" }],
      logo: pupAdsAsset.url,
      href: "https://www.facebook.com/PUPADSOfficial",
    },
  ];

  return (
    <section className="fade-up">
      <SectionHeader num="06" label="affiliations" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">
        organizations & student leadership
      </h2>

      <div className="mt-8 space-y-3">
        {affs.map((a) => (
          <a
            key={a.short}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden card-soft p-5 transition-all duration-300 hover:card-soft-hover sm:p-6"
          >
            {/* Background acronym */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-6 display-pixel select-none text-[68px] font-bold uppercase leading-none text-ink opacity-[0.045] transition-opacity duration-300 group-hover:opacity-[0.08] sm:text-[84px]"
            >
              {a.short}
            </span>

            <div className="relative flex items-start gap-4 sm:gap-5">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-background p-1 shadow-[var(--shadow-card)] sm:h-14 sm:w-14">
                <img
                  src={a.logo}
                  alt={`${a.short} logo`}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="label-mono">{a.short}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    {a.span}
                  </p>
                </div>
                <h3 className="mt-1 text-[14px] font-medium leading-snug text-ink sm:text-[15px]">
                  {a.org}
                </h3>

                <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {a.roles.map((r) => (
                    <li
                      key={r.r + r.y}
                      className="flex items-baseline gap-2 text-[13px] text-gray-700"
                    >
                      <span>{r.r}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                        · {r.y}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <span className="ml-2 shrink-0 self-center font-mono text-[11px] uppercase tracking-widest text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function EducationSection() {
  const items = [
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
  ];
  return (
    <section className="fade-up">
      <SectionHeader num="07" label="education" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">educational background</h2>

      <div className="relative mt-8 space-y-6 pl-6">
        <span aria-hidden="true" className="edu-line absolute left-0 top-0 h-full w-px bg-gradient-to-b from-ink/60 via-gray-300 to-transparent" />
        {items.map((e, i) => (
          <div
            key={e.school}
            className="group relative tab-enter"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="edu-dot-pulse absolute -left-[29px] top-3 h-2.5 w-2.5 rounded-full border border-gray-300 bg-background transition-all duration-300 group-hover:scale-125 group-hover:border-ink group-hover:bg-ink" />
            <span aria-hidden="true" className="absolute -left-[22px] top-4 h-px w-4 origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
            <div className="card-soft p-6 transition-all duration-500 group-hover:card-soft-hover group-hover:translate-x-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="label-mono">{e.when}</p>
                <p className="font-mono text-[11px] text-gray-500">{e.degree}</p>
              </div>
              <h3 className="mt-2 text-[16px] font-medium text-ink">{e.school}</h3>
              <p className="mt-2 text-justify text-[13px] text-gray-500">{e.note}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

function GallerySection() {
  const items = [
    { tag: "Experience", title: "IEEE ICPEA 2025 — Malaysia", desc: "Research presentation · Selangor, Malaysia" },
    { tag: "Experience", title: "IEEE IBDAP 2025 — Thailand", desc: "Big Data Analytics conference · Chiang Mai, Thailand" },
    { tag: "Fieldwork", title: "BioGrow AI — Deployment", desc: "Smart aquaponics rig on location." },
    { tag: "Lab", title: "Pepperazzi — Test Bench", desc: "Robotic-arm harvesting trials." },
  ];
  return (
    <section className="fade-up">
      <SectionHeader num="08" label="gallery" />
      <h2 className="display-pixel text-2xl lowercase text-ink sm:text-3xl">
        photos from conferences, work, and certifications
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((g, i) => (
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
  );
}

function ContactSection() {
  const items = [
    { k: "phone", v: "+63 927 571 9284", href: "tel:+639275719284" },
    { k: "email", v: "justinedlauredo@gmail.com", href: "mailto:justinedlauredo@gmail.com" },
    { k: "linkedin", v: "justine-lauredo-ece-ect", href: "https://www.linkedin.com/in/justine-lauredo-ece-ect" },
  ];
  return (
    <section className="fade-up">
      <SectionHeader num="09" label="contact" />
      <h2 className="display-pixel text-2xl lowercase leading-tight text-ink sm:text-3xl">
        let's build something that has to work.
      </h2>
      <p className="mt-4 max-w-lg text-justify text-[15px] text-gray-500">
        Open to research collaborations, engineering roles, and applied-AI projects across
        robotics, IoT, and renewable energy. The fastest way to reach me is by phone or
        email.
      </p>

      <div className="mt-8 divide-y divide-gray-200 border border-gray-200">
        {items.map((c) => (
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
  );
}

/* ---------- Root Portfolio ---------- */

function Portfolio() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string") setActive(detail);
    };
    document.addEventListener("nav:go", handler);
    return () => document.removeEventListener("nav:go", handler);
  }, []);

  const renderActive = () => {
    switch (active) {
      case "about":
        return <AboutSection />;
      case "licenses":
        return <LicensesSection />;
      case "experience":
        return <ExperienceSection />;
      case "research":
        return <ResearchSection />;
      case "publications":
        return <PublicationsSection />;
      case "affiliations":
        return <AffiliationsSection />;
      case "education":
        return <EducationSection />;
      case "gallery":
        return <GallerySection />;
      case "contact":
        return <ContactSection />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div id="top" className="flex h-screen flex-col overflow-hidden text-foreground lg:block">
      <Sidebar active={active} onSelect={setActive} />
      <TopBar active={active} onSelect={setActive} />

      <main className="min-h-0 flex-1 overflow-hidden lg:ml-56 lg:h-screen">
        <div key={active} className="tab-enter h-full overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-16">
            {renderActive()}

            <footer className="mt-16 border-t border-gray-200 pt-6 sm:mt-20 sm:pt-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                <p className="font-mono text-[10px] normal-case tracking-wide text-gray-500 sm:text-[11px]">
                  © {new Date().getFullYear()} Justine D. Lauredo, ECE, ECT · All signals reserved.
                </p>
                <p className="font-mono text-[10px] normal-case tracking-wide text-gray-400 sm:text-[11px]">
                  Muntinlupa, PH · UTC+8 · Inspired by: Bryl Minimal
                </p>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
