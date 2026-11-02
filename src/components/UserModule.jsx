import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Layers } from 'lucide-react';

export default function UserModule() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    // Initial seed for projects if empty
    if (!localStorage.getItem('projects')) {
      const defaultProjects = [
        {
          id: 101,
          title: "E-Commerce Storefront",
          category: "Full Stack",
          description: "Full-featured online shopping platform with product filtering, cart management, and checkout.",
          tech: ["React", "Node.js", "MongoDB", "Tailwind"]
        },
        {
          id: 102,
          title: "Task Management Dashboard",
          category: "Frontend",
          description: "Interactive Kanban-style task tracking app with drag-and-drop features and local state persistence.",
          tech: ["React", "JavaScript", "Tailwind CSS"]
        },
        {
          id: 103,
          title: "REST API Analytics Engine",
          category: "Backend",
          description: "High-performance backend service for tracking API requests, rate-limiting, and error logging.",
          tech: ["Node.js", "Express", "PostgreSQL", "Docker"]
        }
      ];
      localStorage.setItem('projects', JSON.stringify(defaultProjects));
    }

    const loadedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(loadedProjects);
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({
      id: Date.now(),
      ...contactData,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('messages', JSON.stringify(messages));
    showToastMsg("Message sent successfully!");
    setContactData({ name: '', email: '', message: '' });
  };

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="space-y-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Hi, I'm <span className="text-indigo-500">Sampreeth Bunga</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Computer Science & Engineering Student | Full Stack & Systems Developer
        </p>
      </section>

      {/* Projects Showcase */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Project Showcase
          </h2>
          <p className="text-slate-400 text-sm">Dynamic projects list rendered from LocalStorage</p>
        </div>

        {/* Categories Filter */}
        <div className="flex justify-center gap-2 flex-wrap">
          {['All', 'Frontend', 'Backend', 'Full Stack'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              No projects found for category "{filter}".
            </div>
          ) : (
            filteredProjects.map((p) => (
              <div key={p.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-md">
                <div className="space-y-3">
                  <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {p.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">{p.title}</h3>
                  <p className="text-slate-400 text-sm">{p.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tech.map((t, i) => (
                    <span key={i} className="bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-xl mx-auto bg-slate-800/60 border border-slate-700 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Get In Touch</h2>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input
              type="text"
              required
              value={contactData.name}
              onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={contactData.message}
              onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Your inquiry message..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
