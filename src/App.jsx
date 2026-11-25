import { SpeedInsights } from '@vercel/speed-insights/react';
import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutGrid,
  FolderKanban,
  Mail,
  ShieldCheck,
  Sparkles,
  LogIn,
  LogOut,
  Sun,
  Moon,
  CheckCircle2,
  X,
  Menu,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserModule from './components/UserModule';
import AdminModule from './components/AdminModule';
import AuthModal from './components/AuthModal';

function WorkspaceShell() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('user');
  const [activeSection, setActiveSection] = useState('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subtleSurface, setSubtleSurface] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (activeTab === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      setActiveTab('user');
    }
  }, [activeTab, currentUser]);

  const jumpTo = (tab, sectionId) => {
    setActiveTab(tab);
    if (sectionId) setActiveSection(sectionId);
    setMobileOpen(false);
    if (sectionId && tab === 'user') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const initials = (currentUser?.name || 'SB')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`min-h-screen flex text-slate-100 antialiased selection:bg-teal-500/30 selection:text-teal-200 ${
        subtleSurface ? 'bg-[#061012]' : 'bg-slate-950'
      }`}
    >
      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-64 shrink-0 flex flex-col justify-between overflow-hidden border-r border-slate-800/90 bg-[#081518] transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      
        <div className="p-5 space-y-7 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => jumpTo('user', 'overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-400 font-bold text-sm">
                SB
              </div>
              <div>
                <div className="font-bold text-base tracking-tight text-white group-hover:text-teal-300 transition">
                  Sampreeth Bunga
                </div>
                <div className="text-[11px] text-slate-400">Portfolio &amp; Lab OS</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Showcase Nav */}
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Portfolio
            </p>
            <button
              type="button"
              onClick={() => jumpTo('user', 'overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'user' && activeSection === 'overview'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('user', 'projects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'user' && activeSection === 'projects'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              <span>Projects</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('user', 'contact')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'user' && activeSection === 'contact'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Contact</span>
            </button>
          </div>

          {/* Admin Workspace Nav */}
          {currentUser && currentUser.role === 'admin' && (
            <div className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Admin Workspace
              </p>
              <button
                type="button"
                onClick={() => jumpTo('admin', 'admin-panel')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'admin'
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Profile / Auth Footer */}
        <div className="p-4 border-t border-slate-800/90 bg-[#061114]">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xs font-bold text-teal-300 shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 capitalize truncate">{currentUser.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setActiveTab('user');
                  showToast('Signed out');
                }}
                title="Logout"
                aria-label="Logout"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 px-3 py-2 text-sm font-medium text-teal-300 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#071316]/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              {activeTab === 'admin' ? 'Admin module' : 'Hackathon showcase'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSubtleSurface((s) => !s)}
              title="Toggle surface contrast"
              aria-label="Toggle surface contrast"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {subtleSurface ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 pl-1.5 pr-3 py-1">
              <span className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center">
                {initials}
              </span>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {currentUser ? currentUser.name : 'Guest'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-7">
          {activeTab === 'user' ? (
            <UserModule showToast={showToast} />
          ) : (
            <div id="admin-panel">
              <AdminModule showToast={showToast} />
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-teal-500/30 bg-[#0b1d21] px-4 py-3 text-sm text-slate-100 shadow-2xl"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        showToast={showToast}
      />
      <SpeedInsights />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceShell />
    </AuthProvider>
  );
} 