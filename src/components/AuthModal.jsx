import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, showToast }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setError(res.message);
        return;
      }
      showToast?.(`Signed in as ${res.user.name}`);
      onClose();
    } else {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      const res = signup({ name, email, password, headline });
      if (!res.success) {
        setError(res.message);
        return;
      }
      showToast?.(`Workspace created for ${res.user.name}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {mode === 'login' ? 'Sign in to workspace' : 'Create your portfolio'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === 'login'
                ? 'Access your personal portfolio studio and project manager.'
                : 'Register an account to customize your profile and publish projects.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 rounded-lg border border-zinc-800 bg-zinc-900/70 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-1.5 rounded-md transition ${
              mode === 'login' ? 'bg-white text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-1.5 rounded-md transition ${
              mode === 'signup' ? 'bg-white text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Headline / Role
                </label>
                <input
                  type="text"
                  placeholder="Frontend Engineer & Designer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email *</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition"
          >
            <span>{mode === 'login' ? 'Continue' : 'Create My Portfolio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode === 'login' && (
          <p className="text-[11px] text-zinc-500 text-center">
            Demo account: <span className="text-zinc-300">admin@portfolio.com</span> /{' '}
            <span className="text-zinc-300">password123</span>
          </p>
        )}
      </div>
    </div>
  );
}