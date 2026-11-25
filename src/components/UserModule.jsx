import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  RotateCcw,
  X,
  Loader2,
  FolderKanban,
  Code2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack'];

const CATEGORY_COLORS = {
  'Full Stack': { stroke: '#2dd4bf', dot: 'bg-teal-400', badge: 'text-teal-300 bg-teal-500/10 border-teal-500/25' },
  Frontend: { stroke: '#60a5fa', dot: 'bg-blue-400', badge: 'text-blue-300 bg-blue-500/10 border-blue-500/25' },
  Backend: { stroke: '#a78bfa', dot: 'bg-violet-400', badge: 'text-violet-300 bg-violet-500/10 border-violet-500/25' },
  Other: { stroke: '#fbbf24', dot: 'bg-amber-400', badge: 'text-amber-300 bg-amber-500/10 border-amber-500/25' },
};

const DEFAULT_PROJECTS = [
  {
    id: 201,
    title: 'Student Management & Grade Calculator',
    category: 'Frontend',
    description:
      'React + Vite web application with automated grade/GPA calculation, structured headers/footers, and clean student record views.',
    problem:
      'Calculating course outcomes and student grades across entries manually is slow and prone to arithmetic slips.',
    solution:
      'Built a fast React interface with Math-based grade computation, instant state updates, and responsive Tailwind layouts.',
    highlights: [
      'Automated grade and percentage/GPA calculation using deterministic Math logic',
      'Clean component layout with dedicated header/footer shell and zero page reloads',
      'Fast Vite + Tailwind CSS build pipeline ready for live hackathon demos',
    ],
    tech: ['React', 'Vite', 'JavaScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com',
    liveUrl: '',
  },
  {
    id: 202,
    title: 'Interactive Portfolio & Admin Workspace',
    category: 'Full Stack',
    description:
      'Role-aware portfolio showcase with a visitor dashboard, project case-study modal, Web3Forms contact flow, and gated admin view.',
    problem:
      'Standard portfolio sites present static cards without category telemetry, deep case-study previews, or live content management.',
    solution:
      'Structured separate User and Admin views with live KPI/donut/stack analytics, modal case studies, and instant form feedback.',
    highlights: [
      'Dynamic KPI metrics, category donut breakdown, and tech stack bar chart',
      'Interactive case-study modal with problem/solution context and keyboard dismiss',
      'Admin workflow for managing projects and inquiries plus Web3Forms submission',
    ],
    tech: ['React', 'Tailwind CSS', 'Web3Forms', 'Vercel'],
    githubUrl: 'https://github.com',
    liveUrl: window.location.origin,
  },
  {
    id: 203,
    title: 'STM32 Real-Time Patient Health Monitor',
    category: 'Backend',
    description:
      'Embedded firmware workflow on STM32 NUCLEO-F401RE / F446RE for acquiring physiological readings, scaling values, and flagging alerts.',
    problem:
      'Raw sensor readings need real-time unit scaling and threshold checks without blocking deterministic microcontroller execution.',
    solution:
      'Implemented structured timer/peripheral sampling and integer/floating-point scaling operations on STM32 Nucleo hardware.',
    highlights: [
      'Targeted STM32 NUCLEO-F401RE and F446RE development boards with clean register/HAL logic',
      'Accurate sensor calibration multiplication and division scaling for readable vitals',
      'Designed for predictable real-time loop execution and clear viva/demo walkthroughs',
    ],
    tech: ['Embedded C', 'STM32 Nucleo', 'Timers & ADC', 'Hardware'],
    githubUrl: 'https://github.com',
    liveUrl: '',
  },
  {
    id: 204,
    title: 'Python Pathfinding & CSP Solver Suite',
    category: 'Frontend',
    description:
      'Algorithmic implementations for grid/graph pathfinding and constraint satisfaction problems (CSPs) focused on clarity and correctness.',
    problem:
      'Exploring search heuristics and constraint propagation is hard when logic is tangled inside unorganized scripts.',
    solution:
      'Separated search/constraint rules, state transitions, and evaluation checks into modular, testable Python routines.',
    highlights: [
      'Covers shortest-path search strategies and constraint satisfaction assignments',
      'Clean state representation and pruning logic to cut redundant exploration',
      'Easy to trace step-by-step when explaining algorithm trade-offs to judges',
    ],
    tech: ['Python', 'Pathfinding', 'CSP', 'Algorithms'],
    githubUrl: 'https://github.com',
    liveUrl: '',
  },
];

export default function UserModule({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localToast, setLocalToast] = useState('');

  const notify = (msg) => {
    if (typeof showToast === 'function') {
      showToast(msg, 'success');
    } else {
      setLocalToast(msg);
      setTimeout(() => setLocalToast(''), 3000);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify(DEFAULT_PROJECTS));
    }
    const loadedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const loadedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setProjects(loadedProjects);
    setMessagesCount(loadedMessages.length);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Category distribution for Donut Chart
  const categoryStats = useMemo(() => {
    const total = projects.length;
    const order = ['Full Stack', 'Frontend', 'Backend'];
    const counts = order.map((cat) => {
      const count = projects.filter((p) => p.category === cat).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        label: cat,
        count,
        pct,
        color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other,
      };
    });
    return { total, items: counts };
  }, [projects]);

  // Top technologies for Horizontal Progress Bars
  const techStats = useMemo(() => {
    const freq = {};
    projects.forEach((p) => {
      (Array.isArray(p.tech) ? p.tech : []).forEach((t) => {
        const key = t.trim();
        if (key) freq[key] = (freq[key] || 0) + 1;
      });
    });
    const entries = Object.entries(freq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 6);
    const max = entries.length > 0 ? entries[0].count : 1;
    return { entries, max, uniqueTotal: Object.keys(freq).length };
  }, [projects]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      access_key: '23ef69f0-0f90-44c3-b1d7-2cb03a27c841',
      name: contactData.name.trim(),
      email: contactData.email.trim(),
      message: contactData.message.trim(),
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push({
        id: Date.now(),
        ...contactData,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem('messages', JSON.stringify(messages));
      setMessagesCount(messages.length);

      if (result.success) {
        notify('Message sent successfully!');
        setContactData({ name: '', email: '', message: '' });
      } else {
        notify(result.message || 'Saved locally.');
      }
    } catch {
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push({
        id: Date.now(),
        ...contactData,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem('messages', JSON.stringify(messages));
      setMessagesCount(messages.length);
      notify('Saved locally (offline fallback).');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  // SVG Donut Geometry
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let cumulativeFraction = 0;

  const fullStackCount = projects.filter((p) => p.category === 'Full Stack').length;
  const fullStackShare =
    projects.length > 0 ? Math.round((fullStackCount / projects.length) * 100) : 0;

  return (
    <div id="overview" className="space-y-6 scroll-mt-24">
      {!showToast && localToast && (
        <div className="fixed bottom-5 right-5 bg-[#0b1d21] border border-teal-500/30 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Workspace Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {greeting}, Sampreeth
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A live view of portfolio projects, stack distribution, and interactive case studies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="#projects"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 px-3.5 py-2 text-xs font-semibold text-teal-300 transition"
          >
            Browse Projects
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b191d] hover:bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* 4-Card KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#0b191d] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total projects</span>
            <FolderKanban className="w-4 h-4 text-teal-400/80" />
          </div>
          <div className="mt-2.5 text-3xl font-bold text-white">{projects.length}</div>
          <p className="mt-1.5 text-xs text-slate-500">
            {CATEGORIES.length - 1} active tracks
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#0b191d] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Technologies</span>
            <Code2 className="w-4 h-4 text-blue-400/80" />
          </div>
          <div className="mt-2.5 text-3xl font-bold text-white">{techStats.uniqueTotal}</div>
          <p className="mt-1.5 text-xs text-slate-500">Distinct tools &amp; frameworks</p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#0b191d] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Full stack ratio</span>
            <Sparkles className="w-4 h-4 text-violet-400/80" />
          </div>
          <div className="mt-2.5 text-3xl font-bold text-white">{fullStackShare}%</div>
          <p className="mt-1.5 text-xs text-slate-500">
            {fullStackCount} of {projects.length} end-to-end builds
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#0b191d] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-400/80" />
          </div>
          <div className="mt-2.5 text-3xl font-bold text-white">{messagesCount}</div>
          <p className="mt-1.5 text-xs text-slate-500">Logged via contact form</p>
        </div>
      </section>

      {/* Analytics Row: Donut Chart + Horizontal Bars */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Distribution Donut */}
        <div className="rounded-xl border border-slate-800/90 bg-[#0b191d] p-6">
          <h2 className="text-base font-semibold text-white">Category distribution</h2>

          <div className="mt-5 flex flex-col sm:flex-row items-center gap-7">
            <div className="relative h-36 w-36 shrink-0 flex items-center justify-center">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 112 112">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="transparent"
                  stroke="#13262b"
                  strokeWidth="12"
                />
                {categoryStats.total > 0 &&
                  categoryStats.items.map((item) => {
                    if (item.count === 0) return null;
                    const fraction = item.count / categoryStats.total;
                    const dashLength = Math.max(fraction * circumference - 3, 2);
                    const dashOffset = -cumulativeFraction * circumference;
                    cumulativeFraction += fraction;

                    return (
                      <circle
                        key={item.label}
                        cx="56"
                        cy="56"
                        r={radius}
                        fill="transparent"
                        stroke={item.color.stroke}
                        strokeWidth="12"
                        strokeDasharray={`${dashLength} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    );
                  })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white">{categoryStats.total}</span>
                <span className="text-[11px] text-slate-400">projects</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              {categoryStats.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-xs ${item.color.dot}`} />
                    <span className="text-slate-200">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="font-semibold text-white">{item.count}</span>
                    <span className="w-9 text-right text-xs text-slate-400">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Used Technologies Progress Bars */}
        <div className="rounded-xl border border-slate-800/90 bg-[#0b191d] p-6">
          <h2 className="text-base font-semibold text-white">Most used technologies</h2>

          <div className="mt-5 space-y-3.5">
            {techStats.entries.length === 0 ? (
              <p className="text-sm text-slate-500">No technology tags added yet.</p>
            ) : (
              techStats.entries.map((tech) => {
                const widthPct = Math.round((tech.count / techStats.max) * 100);
                return (
                  <div key={tech.name} className="grid grid-cols-12 items-center gap-3 text-sm">
                    <span className="col-span-4 truncate text-slate-300">{tech.name}</span>
                    <div className="col-span-7 h-2 rounded-full bg-[#13262b] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="col-span-1 text-right font-semibold text-slate-200 tabular-nums">
                      {tech.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Project Showcase Section */}
      <section id="projects" className="scroll-mt-24 rounded-xl border border-slate-800/90 bg-[#0b191d] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              Project showcase
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any card to inspect problem breakdown, architecture highlights, and stack
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40'
                      : 'bg-[#081316] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[11px] opacity-80">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-800 bg-[#081316] text-center py-10 px-4 space-y-3">
              <p className="text-sm text-slate-400">
                No projects found for category &ldquo;{filter}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setFilter('All')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset filter
              </button>
            </div>
          ) : (
            filteredProjects.map((p) => {
              const catStyle = CATEGORY_COLORS[p.category] || CATEGORY_COLORS.Other;
              return (
                <article
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(p);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="group cursor-pointer rounded-xl border border-slate-800 bg-[#081316] p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/60 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${catStyle.badge}`}
                      >
                        {p.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 group-hover:text-teal-300 transition">
                        Inspect
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-teal-200 transition">
                      {p.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">{p.description}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {(Array.isArray(p.tech) ? p.tech : []).map((t, i) => (
                      <span
                        key={i}
                        className="bg-[#0d1e23] text-slate-300 text-[11px] px-2 py-0.5 rounded border border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Contact Card */}
      <section
        id="contact"
        className="scroll-mt-24 rounded-xl border border-slate-800/90 bg-[#0b191d] p-6"
      >
        <div className="max-w-xl mx-auto">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Get In Touch</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Send feedback, collaboration ideas, or hackathon inquiries directly.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#081316] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/60 transition"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#081316] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/60 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows="3"
                value={contactData.message}
                onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-lg bg-[#081316] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/60 transition"
                placeholder="Your inquiry message..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 py-2 px-5 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 rounded-lg text-slate-950 text-sm font-semibold transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Project Case-Study Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="selected-project-title"
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0b191d] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
              <div>
                <span className="inline-block bg-teal-500/10 text-teal-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-teal-500/25">
                  {selectedProject.category}
                </span>
                <h3
                  id="selected-project-title"
                  className="mt-2 text-xl font-bold text-white"
                >
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-5 text-sm text-slate-300">
              <p className="leading-relaxed">{selectedProject.description}</p>

              {(selectedProject.problem || selectedProject.solution) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedProject.problem && (
                    <div className="rounded-xl border border-slate-800 bg-[#081316] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                        Problem
                      </p>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {selectedProject.problem}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="rounded-xl border border-slate-800 bg-[#081316] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
                        Solution
                      </p>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {Array.isArray(selectedProject.highlights) && selectedProject.highlights.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Key Highlights
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    {selectedProject.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(selectedProject.tech) && selectedProject.tech.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tech.map((t, i) => (
                      <span
                        key={i}
                        className="bg-[#081316] text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-800 bg-[#081316] px-6 py-3.5">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition"
                >
                  <span>Live App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-medium text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}