import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  FolderKanban,
  Eraser,
  X,
} from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  category: 'Frontend',
  description: '',
  tech: '',
  problem: '',
  solution: '',
  githubUrl: '',
  liveUrl: '',
};

export default function AdminModule({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const notify = (msg) => {
    if (typeof showToast === 'function') {
      showToast(msg, 'success');
    }
  };

  const loadData = () => {
    setProjects(JSON.parse(localStorage.getItem('projects')) || []);
    setMessages(JSON.parse(localStorage.getItem('messages')) || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title || '',
      category: p.category || 'Frontend',
      description: p.description || '',
      tech: Array.isArray(p.tech) ? p.tech.join(', ') : '',
      problem: p.problem || '',
      solution: p.solution || '',
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let currentProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const techArray = formData.tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      tech: techArray,
      problem: formData.problem.trim(),
      solution: formData.solution.trim(),
      githubUrl: formData.githubUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
    };

    if (editingId) {
      currentProjects = currentProjects.map((p) =>
        p.id === editingId ? { ...p, id: editingId, ...payload } : p
      );
      notify('Project updated');
    } else {
      currentProjects.push({ id: Date.now(), ...payload });
      notify('Project added');
    }

    localStorage.setItem('projects', JSON.stringify(currentProjects));
    setModalOpen(false);
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      localStorage.setItem('projects', JSON.stringify(updated));
      loadData();
      notify('Project deleted');
    }
  };

  const handleClearMessages = () => {
    localStorage.removeItem('messages');
    setMessages([]);
    notify('Inquiries inbox cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/90 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage showcase projects and review visitor contact submissions
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Managed Projects Table */}
        <div className="lg:col-span-2 bg-[#0b191d] border border-slate-800/90 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-teal-400" />
              Managed projects
            </h2>
            <span className="text-xs text-slate-400">{projects.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#081316] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3 rounded-tl-lg">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-slate-500 text-xs">
                      No projects found. Click &ldquo;Add Project&rdquo; to create one.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#081316]/70 transition">
                      <td className="p-3 font-semibold text-white">{p.title}</td>
                      <td className="p-3">
                        <span className="bg-teal-500/10 text-teal-300 text-xs px-2.5 py-0.5 rounded-full border border-teal-500/25">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="bg-[#081316] hover:bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs inline-flex items-center gap-1 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 px-2.5 py-1 rounded-lg text-xs inline-flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Inquiries Inbox */}
        <div className="bg-[#0b191d] border border-slate-800/90 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" />
              Inquiries Inbox
            </h2>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearMessages}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 px-2.5 py-1 rounded-lg transition"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear Inbox
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-xs">
                No messages received yet.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#081316] border border-slate-800 p-4 rounded-xl space-y-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-teal-300 text-sm">{m.name}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.email}</p>
                  <p className="text-xs text-slate-200 mt-2 bg-[#0d1e23] border border-slate-800/80 p-2.5 rounded-lg">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-project-modal-title"
        >
          <div
            className="bg-[#0b191d] border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="admin-project-modal-title" className="text-lg font-bold text-white">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/60"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tech Stack (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Vite, Tailwind"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Problem (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="What friction did it solve?"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Solution (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="How did you build it?"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full bg-[#081316] border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#081316] hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-semibold transition"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
