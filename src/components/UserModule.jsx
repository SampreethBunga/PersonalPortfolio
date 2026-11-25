import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  Layers,
  ArrowUpRight,
  RotateCcw,
  X,
  Loader2,
  FolderKanban,
  Code2,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack'];

const YELLOW_SERIES = {
  'Full Stack': { stroke: '#eab308', dot: 'bg-yellow-500' },
  Frontend: { stroke: '#facc15', dot: 'bg-yellow-400' },
  Backend: { stroke: '#fde047', dot: 'bg-yellow-300' },
};

export default function UserModule({ showToast, onOpenAuth, onEditOwn }) {
  const { currentUser, activeOwner, activeProjects } = useAuth();
  const [messagesCount, setMessagesCount] = useState(0);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnPortfolio = currentUser && activeOwner && currentUser.id === activeOwner.id;

  useEffect(() => {
    const allMessages = JSON.parse(localStorage.getItem('app_messages')) || [];
    const ownerMessages = allMessages.filter((m) => m.recipientId === activeOwner?.id);
    setMessagesCount(ownerMessages.length);
  }, [activeOwner]);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  const categoryStats = useMemo(() => {
    const total = activeProjects.length;
    const order = ['Full Stack', 'Frontend', 'Backend'];
    const items = order.map((cat) => {
      const count = activeProjects.filter((p) => p.category === cat).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        label: cat,
        count,
        pct,
        color: YELLOW_SERIES[cat],
      };
    });
    return { total, items };
  }, [activeProjects]);

  const techStats = useMemo(() => {
    const freq = {};
    activeProjects.forEach((p) => {
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
  }, [activeProjects]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      access_key: '23ef69f0-0f90-44c3-b1d7-2cb03a27c841',
      name: contactData.name.trim(),
      email: contactData.email.trim(),
      message: `[To: ${activeOwner?.name}] ${contactData.message.trim()}`,
    };

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Fallback to local storage
    } finally {
      const allMessages = JSON.parse(localStorage.getItem('app_messages')) || [];
      allMessages.push({
        id: Date.now(),
        recipientId: activeOwner?.id,
        ...contactData,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem('app_messages', JSON.stringify(allMessages));
      setMessagesCount(
        allMessages.filter((m) => m.recipientId === activeOwner?.id).length
      );
      setContactData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
      showToast?.(`Message sent to ${activeOwner?.name}`);
    }
  };

  const filteredProjects =
    filter === 'All'
      ? activeProjects
      : activeProjects.filter((p) => p.category === filter);

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let cumulativeFraction = 0;

  return (
    <div id="overview" className="space-y-8 scroll-mt-20">
      {/* White & Yellow Hero Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-block rounded-md bg-yellow-300/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-zinc-900">
            Developer Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {activeOwner?.name}
          </h1>
          <p className="text-sm font-medium text-zinc-600 max-w-2xl">{activeOwner?.headline}</p>
          {activeOwner?.bio && (
            <p className="text-xs text-zinc-500 max-w-2xl">{activeOwner.bio}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isOwnPortfolio ? (
            <button
              type="button"
              onClick={onEditOwn}
              className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-[0.97] px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Manage My Projects
            </button>
          ) : (
            !currentUser && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-[0.97] px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-xs transition-all"
              >
                Build Your Own Portfolio
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </section>

      {/* 3-Card KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs hover:border-yellow-400 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Published projects</span>
            <span className="p-1.5 rounded-lg bg-yellow-100 text-amber-700">
              <FolderKanban className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{activeProjects.length}</div>
          <p className="mt-1 text-xs text-zinc-500">Across {CATEGORIES.length - 1} tracks</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs hover:border-yellow-400 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Technologies</span>
            <span className="p-1.5 rounded-lg bg-yellow-100 text-amber-700">
              <Code2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{techStats.uniqueTotal}</div>
          <p className="mt-1 text-xs text-zinc-500">Distinct tools &amp; frameworks</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs hover:border-yellow-400 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Inquiries</span>
            <span className="p-1.5 rounded-lg bg-yellow-100 text-amber-700">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{messagesCount}</div>
          <p className="mt-1 text-xs text-zinc-500">Messages received</p>
        </div>
      </section>

      {/* White & Yellow Analytics Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-zinc-900">Category distribution</h2>

          <div className="mt-5 flex flex-col sm:flex-row items-center gap-7">
            <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 112 112">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="transparent"
                  stroke="#f4f4f5"
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
                        className="transition-all duration-500"
                      />
                    );
                  })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-zinc-900">{categoryStats.total}</span>
                <span className="text-[11px] font-medium text-zinc-500">total</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2.5">
              {categoryStats.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border border-amber-400/50 ${item.color.dot}`}
                    />
                    <span className="font-medium text-zinc-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="font-bold text-zinc-900">{item.count}</span>
                    <span className="w-8 text-right text-zinc-500">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-zinc-900">Top technologies</h2>

          <div className="mt-5 space-y-3.5">
            {techStats.entries.length === 0 ? (
              <p className="text-xs text-zinc-500">No projects published yet.</p>
            ) : (
              techStats.entries.map((tech) => {
                const widthPct = Math.round((tech.count / techStats.max) * 100);
                return (
                  <div key={tech.name} className="grid grid-cols-12 items-center gap-3 text-xs">
                    <span className="col-span-4 truncate font-medium text-zinc-700">
                      {tech.name}
                    </span>
                    <div className="col-span-7 h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="col-span-1 text-right font-bold text-zinc-900 tabular-nums">
                      {tech.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section
        id="projects"
        className="scroll-mt-20 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Projects
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Click any card to open the problem breakdown and technical details
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? activeProjects.length
                  : activeProjects.filter((p) => p.category === cat).length;
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 active:scale-95 ${
                    active
                      ? 'bg-yellow-400 text-zinc-950 font-bold shadow-2xs'
                      : 'bg-stone-50 text-zinc-600 border border-zinc-200 hover:bg-yellow-50 hover:text-zinc-900 font-medium'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[11px] opacity-80">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-zinc-300 bg-stone-50 text-center py-10 px-4 space-y-3">
              <p className="text-xs text-zinc-500">
                {activeProjects.length === 0
                  ? `${activeOwner?.name} hasn't published any projects yet.`
                  : `No projects in "${filter}".`}
              </p>
              {activeProjects.length === 0 && isOwnPortfolio ? (
                <button
                  type="button"
                  onClick={onEditOwn}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 px-3.5 py-2 text-xs font-bold text-zinc-950 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Your First Project
                </button>
              ) : (
                filter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setFilter('All')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-zinc-200 hover:bg-yellow-50 active:scale-95 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset filter
                  </button>
                )
              )}
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
                className="group cursor-pointer rounded-2xl border border-zinc-200 bg-stone-50/60 p-5 flex flex-col justify-between hover:-translate-y-1 hover:bg-white hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/10 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-yellow-300 bg-yellow-100 text-zinc-900">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                      Inspect
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900">{p.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-600">{p.description}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(Array.isArray(p.tech) ? p.tech : []).map((t, i) => (
                    <span
                      key={i}
                      className="bg-white text-zinc-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-zinc-200"
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
        className="scroll-mt-20 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs"
      >
        <div className="max-w-xl mx-auto">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-zinc-900">
              Message {activeOwner?.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Send a direct inquiry or collaboration note.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Message</label>
              <textarea
                required
                rows="3"
                value={contactData.message}
                onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                placeholder="Write a message..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.97] disabled:opacity-60 rounded-xl text-zinc-950 text-xs font-bold shadow-xs transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Animated Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm animate-backdrop-in"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 bg-stone-50/80 px-6 py-4">
              <div>
                <span className="inline-block border border-yellow-300 bg-yellow-100 text-zinc-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedProject.category}
                </span>
                <h3 className="mt-2 text-lg font-bold text-zinc-900">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-yellow-100 hover:text-zinc-900 active:scale-95 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-5 text-sm text-zinc-700">
              <p className="leading-relaxed">{selectedProject.description}</p>

              {(selectedProject.problem || selectedProject.solution) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedProject.problem && (
                    <div className="rounded-xl border border-zinc-200 bg-stone-50 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                        Problem
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-700">
                        {selectedProject.problem}
                      </p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="rounded-xl border border-yellow-300/70 bg-yellow-50/70 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 mb-1">
                        Solution
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-700">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {Array.isArray(selectedProject.highlights) && selectedProject.highlights.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Key Highlights
                  </p>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {selectedProject.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(selectedProject.tech) && selectedProject.tech.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tech.map((t, i) => (
                      <span
                        key={i}
                        className="bg-stone-100 text-zinc-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-stone-50 px-6 py-3.5">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white hover:bg-stone-100 active:scale-95 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 transition"
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 px-3.5 py-1.5 text-xs font-bold text-zinc-950 transition"
                >
                  <span>Live App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 px-4 py-1.5 text-xs font-semibold text-white transition"
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