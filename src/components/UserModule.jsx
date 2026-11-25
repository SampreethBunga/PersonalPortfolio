import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  RotateCcw,
  Share2,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack'];

const DEFAULT_PROJECTS = [
  {
    id: 101,
    title: 'E-Commerce Storefront',
    category: 'Full Stack',
    description:
      'Full-featured online shopping platform with product filtering, cart management, and checkout.',
    problem:
      'Shoppers often lose cart state or struggle with slow catalog filtering across multi-attribute product lists.',
    solution:
      'Built modular catalog filters, predictable cart state updates, and a streamlined checkout flow with responsive layouts.',
    highlights: [
      'Instant category and attribute filtering with zero full-page reloads',
      'Persistent shopping cart with quantity controls and subtotal calculation',
      'Responsive storefront layout tuned for desktop and mobile viewports',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
  },
  {
    id: 102,
    title: 'Task Management Dashboard',
    category: 'Frontend',
    description:
      'Interactive Kanban-style task tracking app with drag-and-drop features and local state persistence.',
    problem:
      'Static to-do lists make it hard to track workflow stages and priorities at a glance during fast sprints.',
    solution:
      'Created an interactive Kanban board with column status transitions, visual priorities, and local persistence.',
    highlights: [
      'Column-based task organization with instant status updates',
      'Automatic local state persistence across browser reloads',
      'Clean card hierarchy for rapid sprint status checks',
    ],
    tech: ['React', 'JavaScript', 'Tailwind CSS'],
  },
  {
    id: 103,
    title: 'REST API Analytics Engine',
    category: 'Backend',
    description:
      'High-performance backend service for tracking API requests, rate-limiting, and error logging.',
    problem:
      'Unmonitored endpoints risk traffic spikes, abuse, and blind spots when diagnosing production errors.',
    solution:
      'Engineered middleware for request telemetry, rate-limiting protection, and structured error logs.',
    highlights: [
      'Request throughput tracking and structured error log capture',
      'Rate-limiting guardrails to protect endpoints under burst load',
      'Relational storage schema for querying historical endpoint metrics',
    ],
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
  },
];

export default function UserModule({ showToast }) {
  const [projects, setProjects] = useState([]);
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
    setProjects(loadedProjects);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Portfolio link copied to clipboard!');
    } catch {
      notify('Could not copy link automatically.');
    }
  };

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

      if (result.success) {
        notify('Message sent successfully!');
        setContactData({ name: '', email: '', message: '' });
      } else {
        notify(result.message || 'Saved locally; check Web3Forms response.');
      }
    } catch {
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push({
        id: Date.now(),
        ...contactData,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem('messages', JSON.stringify(messages));
      notify('Saved locally (offline/network fallback).');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryCount = (cat) =>
    cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="space-y-16">
      {!showToast && localToast && (
        <div className="fixed bottom-5 right-5 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 px-6 py-12 sm:px-10 sm:py-16 text-center space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Hackathon &amp; Project Showcase</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Hi, I&apos;m <span className="text-indigo-400">Sampreeth Bunga</span>
        </h1>

        <p className="text-slate-300 sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Computer Science &amp; Engineering Student building full-stack web apps, clean UI
          workflows, and practical systems projects.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition"
          >
            Explore Projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition"
          >
            Get In Touch
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            Copy Link
          </button>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="scroll-mt-24 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Project Showcase
          </h2>
          <p className="text-slate-400 text-sm">
            Click any project card to inspect architecture highlights and stack details
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex justify-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800/90 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-indigo-500/40 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-700 bg-slate-900/50 text-center py-12 px-4 space-y-3">
              <p className="text-slate-400">
                No projects found for category &ldquo;{filter}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setFilter('All')}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Show All Projects
              </button>
            </div>
          ) : (
            filteredProjects.map((p) => (
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
                className="group cursor-pointer bg-slate-800/80 border border-slate-700/90 rounded-xl p-6 flex flex-col justify-between hover:-translate-y-0.5 hover:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
                      Details
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-slate-300/90 text-sm leading-relaxed">{p.description}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(Array.isArray(p.tech) ? p.tech : []).map((t, i) => (
                    <span
                      key={i}
                      className="bg-slate-900/90 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="scroll-mt-24 max-w-xl mx-auto w-full bg-slate-800/60 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-6 space-y-1">
          <h2 className="text-2xl font-bold text-white">Get In Touch</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Have feedback, collaboration ideas, or hackathon questions? Drop a note.
          </p>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-slate-200 mb-1">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              value={contactData.name}
              onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-slate-200 mb-1"
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
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows="4"
              value={contactData.message}
              onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              placeholder="Your inquiry message..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
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
        </form>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="selected-project-title"
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
              <div>
                <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
                  {selectedProject.category}
                </span>
                <h3
                  id="selected-project-title"
                  className="mt-2 text-xl sm:text-2xl font-bold text-white"
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
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                        Problem
                      </p>
                      <p className="leading-relaxed text-slate-300">{selectedProject.problem}</p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                        Solution
                      </p>
                      <p className="leading-relaxed text-slate-300">{selectedProject.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {Array.isArray(selectedProject.highlights) && selectedProject.highlights.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Key Highlights
                  </p>
                  <ul className="space-y-1.5">
                    {selectedProject.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
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
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-800 bg-slate-950/50 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-white transition"
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