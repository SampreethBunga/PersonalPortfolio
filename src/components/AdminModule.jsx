import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, FolderKanban } from 'lucide-react';

export default function AdminModule() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Frontend', description: '', tech: '' });

  const loadData = () => {
    setProjects(JSON.parse(localStorage.getItem('projects')) || []);
    setMessages(JSON.parse(localStorage.getItem('messages')) || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'Frontend', description: '', tech: '' });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      category: p.category,
      description: p.description,
      tech: p.tech.join(', ')
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let currentProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const techArray = formData.tech.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      currentProjects = currentProjects.map(p =>
        p.id === editingId ? { id: editingId, ...formData, tech: techArray } : p
      );
    } else {
      currentProjects.push({ id: Date.now(), ...formData, tech: techArray });
    }

    localStorage.setItem('projects', JSON.stringify(currentProjects));
    setModalOpen(false);
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter(p => p.id !== id);
      localStorage.setItem('projects', JSON.stringify(updated));
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage dynamic showcase items & review user contact submissions</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manage Projects Table */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" /> Managed Projects
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-slate-500">No projects found.</td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-700/30">
                      <td className="p-3 font-semibold text-white">{p.title}</td>
                      <td className="p-3">
                        <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded border border-indigo-500/20">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded text-xs inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-600/80 hover:bg-red-500 text-white px-2.5 py-1 rounded text-xs inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Inquiries List */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" /> Inquiries Inbox
          </h2>
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-slate-500 text-center py-6 text-sm">No messages received yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-slate-900/80 border border-slate-700 p-4 rounded-lg space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-indigo-400 text-sm">{m.name}</h4>
                    <span className="text-[10px] text-slate-500">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.email}</p>
                  <p className="text-xs text-slate-300 mt-2 bg-slate-800 p-2 rounded">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-white">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React, Vite, Tailwind"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold"
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
