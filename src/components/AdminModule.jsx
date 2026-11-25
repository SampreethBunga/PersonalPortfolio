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
  Sparkles,
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
  const {
    currentUser,
    activeProjects,
    activeSkills,
    updateUserProfile,
    saveUserProjects,
    saveUserSkills,
  } = useAuth();

  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [profileForm, setProfileForm] = useState({
    name: '',
    headline: '',
    bio: '',
  });
  const [skillForm, setSkillForm] = useState({
    name: '',
    group: 'Frontend',
    level: 'Intermediate',
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

  const userSkills = Array.isArray(activeSkills) ? activeSkills : [];

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      name: profileForm.name.trim() || currentUser.name,
      headline: profileForm.headline.trim(),
      bio: profileForm.bio.trim(),
    });
    showToast?.('Profile updated');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanName = skillForm.name.trim();
    if (!cleanName) return;

    const duplicate = userSkills.some(
      (s) => s.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      showToast?.('Skill already in your list');
      return;
    }

    const nextSkills = [
      ...userSkills,
      {
        id: `skill_${Date.now()}`,
        name: cleanName,
        group: skillForm.group,
        level: skillForm.level,
      },
    ];
    saveUserSkills(currentUser.id, nextSkills);
    setSkillForm((prev) => ({ ...prev, name: '' }));
    showToast?.(`Added ${cleanName}`);
  };

  const handleRemoveSkill = (skillId) => {
    const nextSkills = userSkills.filter((s) => s.id !== skillId);
    saveUserSkills(currentUser.id, nextSkills);
    showToast?.('Skill removed');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            My Portfolio Studio
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Customize your public bio, manage skills, publish projects, and review messages
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.97] text-zinc-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Profile Editor Card */}
      <form
        onSubmit={handleProfileSave}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-500" />
            Profile Details
          </h2>
          <button
            type="submit"
            className="rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 px-3.5 py-1.5 text-xs font-bold text-zinc-950 transition"
          >
            Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 focus:bg-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Headline</label>
            <input
              type="text"
              value={profileForm.headline}
              onChange={(e) => setProfileForm((p) => ({ ...p, headline: e.target.value }))}
              className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 focus:bg-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Short Bio</label>
          <input
            type="text"
            value={profileForm.bio}
            onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
            className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 focus:bg-white focus:border-yellow-400 focus:outline-none"
          />
        </div>
      </form>

      {/* Skills Manager Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Skills
          </h2>
          <span className="text-xs font-semibold text-zinc-500">{userSkills.length} added</span>
        </div>

        <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            required
            placeholder="e.g., TypeScript, Docker, SQL"
            value={skillForm.name}
            onChange={(e) => setSkillForm((prev) => ({ ...prev, name: e.target.value }))}
            className="sm:col-span-5 rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-yellow-400 focus:outline-none"
          />
          <select
            value={skillForm.group}
            onChange={(e) => setSkillForm((prev) => ({ ...prev, group: e.target.value }))}
            className="sm:col-span-3 rounded-xl border border-zinc-200 bg-stone-50 px-3 py-2 text-sm text-zinc-900 focus:bg-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Core CS">Core CS</option>
            <option value="Systems">Systems</option>
          </select>
          <select
            value={skillForm.level}
            onChange={(e) => setSkillForm((prev) => ({ ...prev, level: e.target.value }))}
            className="sm:col-span-2 rounded-xl border border-zinc-200 bg-stone-50 px-3 py-2 text-sm text-zinc-900 focus:bg-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button
            type="submit"
            className="sm:col-span-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 px-4 py-2 text-xs font-bold text-zinc-950 transition"
          >
            Add Skill
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          {userSkills.length === 0 ? (
            <p className="text-xs text-zinc-500">No skills added yet.</p>
          ) : (
            userSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-2 rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-yellow-100 animate-modal-in"
              >
                <span>{skill.name}</span>
                <span className="text-[11px] font-medium text-zinc-500">· {skill.level}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  aria-label={`Remove ${skill.name}`}
                  className="text-zinc-500 hover:text-zinc-950 active:scale-90 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Projects & Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-amber-500" />
              My Projects
            </h2>
            <span className="text-xs text-zinc-500">{activeProjects.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead className="bg-stone-50 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {activeProjects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-zinc-500 text-xs">
                      No projects yet. Click &ldquo;New Project&rdquo; to publish one.
                    </td>
                  </tr>
                ) : (
                  activeProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-yellow-50/50 transition">
                      <td className="p-3 font-semibold text-zinc-900">{p.title}</td>
                      <td className="p-3">
                        <span className="bg-yellow-100 text-zinc-900 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-yellow-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="bg-white hover:bg-yellow-50 border border-zinc-300 text-zinc-800 active:scale-95 px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 active:scale-95 px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition"
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

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" />
              Inbox
            </h2>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearMessages}
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 bg-stone-100 hover:bg-yellow-100 border border-zinc-200 active:scale-95 px-2.5 py-1 rounded-lg transition"
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
                  className="bg-stone-50 border border-zinc-200 p-4 rounded-xl space-y-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-zinc-900 text-xs">{m.name}</h4>
                    <span className="text-[10px] text-zinc-500 shrink-0">{m.date}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{m.email}</p>
                  <p className="text-xs text-zinc-800 mt-2 bg-white border border-zinc-200 p-2.5 rounded-lg">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Animated Add/Edit Project Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-backdrop-in"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-base font-bold text-zinc-900">
                {editingId ? 'Edit Project' : 'New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-yellow-100 hover:text-zinc-900 active:scale-95 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-sm focus:bg-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-sm focus:bg-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-sm focus:bg-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tech Stack (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Vite, Tailwind"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-sm focus:bg-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Problem (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Solution (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Live URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-zinc-200 text-zinc-800 active:scale-95 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-zinc-950 rounded-xl text-xs font-bold transition"
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