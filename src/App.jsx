import { SpeedInsights } from '@vercel/speed-insights/react';
import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutGrid,
  FolderKanban,
  Mail,
  SlidersHorizontal,
  LogIn,
  LogOut,
  CheckCircle2,
  X,
  Menu,
  Users,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserModule from './components/UserModule';
import AdminModule from './components/AdminModule';
import AuthModal from './components/AuthModal';

function WorkspaceShell() {
  const {
    users,
    currentUser,
    activeOwner,
    activePortfolioUserId,
    setActivePortfolioUserId,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('user');
  const [activeSection, setActiveSection] = useState('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    if (activeTab === 'studio' && !currentUser) {
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

  const getInitials = (name = 'SB') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 antialiased selection:bg-white/20 selection:text-white">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar (Pinned to Viewport) */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-64 shrink-0 flex flex-col justify-between overflow-hidden border-r border-zinc-800/90 bg-zinc-950 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => jumpTo('user', 'overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-semibold text-xs">
                {getInitials(activeOwner?.name)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm tracking-tight text-white truncate">
                  {activeOwner?.name || 'Portfolio'}
                </div>
                <div className="text-[11px] text-zinc-500">Minimalist Workspace</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Portfolio Navigation */}
          <div className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Showcase
            </p>
            <button
              type="button"
              onClick={() => jumpTo('user', 'overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'user' && activeSection === 'overview'
                  ? 'bg-zinc-900 text-white border border-zinc-800'
                  : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100'
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
                  ? 'bg-zinc-900 text-white border border-zinc-800'
                  : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100'
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
                  ? 'bg-zinc-900 text-white border border-zinc-800'
                  : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Contact</span>
            </button>
          </div>

          {/* Creator Studio (Available to any signed-in user) */}
          {currentUser && (
            <div className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Creator Studio
              </p>
              <button
                type="button"
                onClick={() => {
                  setActivePortfolioUserId(currentUser.id);
                  jumpTo('studio');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'studio'
                    ? 'bg-white text-zinc-950 font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>My Portfolio Studio</span>
              </button>
            </div>
          )}

          {/* Published Portfolios Directory */}
          <div className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              <span>Portfolios ({users.length})</span>
            </p>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {users.map((u) => {
                const isSelected = u.id === activePortfolioUserId && activeTab === 'user';
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setActivePortfolioUserId(u.id);
                      jumpTo('user', 'overview');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition ${
                      isSelected
                        ? 'bg-zinc-900 text-white border border-zinc-800 font-medium'
                        : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {getInitials(u.name)}
                    </span>
                    <span className="truncate">{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Auth Footer */}
        <div className="p-4 shrink-0 border-t border-zinc-800/90 bg-zinc-950">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                  {getInitials(currentUser.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
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
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-950 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Build Yours</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
              {activeTab === 'studio'
                ? 'Creator Studio'
                : `Viewing ${activeOwner?.name || 'Portfolio'}`}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setActivePortfolioUserId(currentUser.id);
                  setActiveTab(activeTab === 'studio' ? 'user' : 'studio');
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition"
              >
                {activeTab === 'studio' ? 'View Live Portfolio' : 'Edit My Portfolio'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-lg bg-white hover:bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition"
              >
                Create Your Portfolio
              </button>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
          {activeTab === 'user' ? (
            <UserModule
              showToast={showToast}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onEditOwn={() => setActiveTab('studio')}
            />
          ) : (
            <AdminModule showToast={showToast} />
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-xs font-medium text-white shadow-2xl"
        >
          <CheckCircle2 className="w-4 h-4 text-zinc-200 shrink-0" />
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