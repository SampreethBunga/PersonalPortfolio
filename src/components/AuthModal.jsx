// src/components/AuthModal.jsx
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs animate-backdrop-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-5 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900">
              {mode === 'login' ? 'Sign in to workspace' : 'Create your portfolio'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {mode === 'login'
                ? 'Access your personal portfolio studio and project manager.'
                : 'Register an account to customize your profile and publish projects.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-yellow-100 hover:text-zinc-900 active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 rounded-xl border border-zinc-200 bg-stone-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-1.5 rounded-lg transition-all active:scale-95 ${
              mode === 'login'
                ? 'bg-yellow-400 text-zinc-950 font-bold shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
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
            className={`py-1.5 rounded-lg transition-all active:scale-95 ${
              mode === 'signup'
                ? 'bg-yellow-400 text-zinc-950 font-bold shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Headline / Role
                </label>
                <input
                  type="text"
                  placeholder="Frontend Engineer & Designer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email *</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-stone-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-xs transition-all"
          >
            <span>{mode === 'login' ? 'Continue' : 'Create My Portfolio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode === 'login' && (
          <p className="text-[11px] text-zinc-500 text-center">
            Demo account: <span className="font-semibold text-zinc-800">admin@portfolio.com</span> /{' '}
            <span className="font-semibold text-zinc-800">password123</span>
          </p>
        )}
      </div>
    </div>
  );
}