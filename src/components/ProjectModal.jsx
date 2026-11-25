import { useEffect } from 'react';
import { X, ExternalLink, Github, Layers, CheckCircle2 } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const techList = Array.isArray(project.tech)
    ? project.tech
    : (project.techStack || project.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-5">
          <div>
            {project.category && (
              <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                {project.category}
              </span>
            )}
            <h3 id="modal-project-title" className="mt-2 text-2xl font-bold text-white">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] space-y-6 overflow-y-auto px-6 py-6 text-slate-300">
          <p className="leading-relaxed text-slate-300">{project.description}</p>

          {(project.problem || project.solution) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.problem && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Problem
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Solution & Impact
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{project.solution}</p>
                </div>
              )}
            </div>
          )}

          {Array.isArray(project.highlights) && project.highlights.length > 0 && (
            <div>
              <h4 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                Key Highlights
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {techList.length > 0 && (
            <div>
              <h4 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Layers className="h-4 w-4 text-indigo-400" />
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/50 px-6 py-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              <Github className="h-4 w-4" />
              Source Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}