// src/components/AdminModule.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  FolderKanban,
  Eraser,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { currentUser, activeProjects, updateUserProfile, saveUserProjects } = useAuth();
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [profileForm, setProfileForm] = useState({
    name: '',
    headline: '',
    bio: '',
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        headline: currentUser.headline || '',
        bio: currentUser.bio || '',
      });
      const allMessages = JSON.parse(localStorage.getItem('app_messages')) || [];
      setMessages(allMessages.filter((m) => m.recipientId === currentUser.id));
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      name: profileForm.name.trim() || currentUser.name,
      headline: profileForm.headline.trim(),
      bio: profileForm.bio.trim(),
    });
    showToast?.('Profile updated');
  };

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

  const handleSaveProject = (e) => {
    e.preventDefault();
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
      const updated = activeProjects.map((p) =>
        p.id === editingId ? { ...p, id: editingId, ...payload } : p
      );
      saveUserProjects(currentUser.id, updated);
      showToast?.('Project updated');
    } else {
      saveUserProjects(currentUser.id, [...activeProjects, { id: Date.now(), ...payload }]);
      showToast?.('Project added to your portfolio');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) {
      saveUserProjects(
        currentUser.id,
        activeProjects.filter((p) => p.id !== id)
      );
      showToast?.('Project removed');
    }
  };

  const handleClearMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem('app_messages')) || [];
    const remaining = allMessages.filter((m) => m.recipientId !== currentUser.id);
    localStorage.setItem('app_messages', JSON.stringify(remaining));
    setMessages([]);
    showToast?.('Inbox cleared');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            My Portfolio Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Customize your public bio, publish projects, and review messages
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded-lg text-xs font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Profile Editor Card */}
      <form
        onSubmit={handleProfileSave}
        className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-zinc-400" />
            Profile Details
          </h2>
          <button
            type="submit"
            className="rounded-lg bg-white hover:bg-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition"
          >
            Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Headline</label>
            <input
              type="text"
              value={profileForm.headline}
              onChange={(e) => setProfileForm((p) => ({ ...p, headline: e.target.value }))}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Short Bio</label>
          <input
            type="text"
            value={profileForm.bio}
            onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </form>

      {/* Projects & Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-zinc-400" />
              My Projects
            </h2>
            <span className="text-xs text-zinc-500">{activeProjects.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {activeProjects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-zinc-500 text-xs">
                      No projects yet. Click &ldquo;New Project&rdquo; to publish one.
                    </td>
                  </tr>
                ) : (
                  activeProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-950/70 transition">
                      <td className="p-3 font-medium text-white">{p.title}</td>
                      <td className="p-3">
                        <span className="bg-zinc-950 text-zinc-300 text-xs px-2.5 py-0.5 rounded-full border border-zinc-800">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-2.5 py-1 rounded-lg text-xs inline-flex items-center gap-1 transition"
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

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              Inbox
            </h2>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearMessages}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg transition"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-zinc-500 text-center py-8 text-xs">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-white text-xs">{m.name}</h4>
                    <span className="text-[10px] text-zinc-500 shrink-0">{m.date}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{m.email}</p>
                  <p className="text-xs text-zinc-300 mt-2 bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">
                {editingId ? 'Edit Project' : 'New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Tech Stack (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Vite, Tailwind"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Problem (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Solution (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Live URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 rounded-lg text-xs font-semibold transition"
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