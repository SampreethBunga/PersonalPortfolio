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
    <div className="min-h-screen flex bg-stone-50 text-zinc-900 antialiased selection:bg-yellow-300 selection:text-zinc-950">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs lg:hidden animate-backdrop-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar (Pinned to Viewport) */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-64 shrink-0 flex flex-col justify-between overflow-hidden border-r border-zinc-200 bg-white transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => jumpTo('user', 'overview')}
              className="flex items-center gap-2.5 text-left group active:scale-[0.98] transition-transform"
            >
              <div className="h-9 w-9 rounded-xl bg-yellow-400 border border-yellow-500/40 flex items-center justify-center text-zinc-950 font-bold text-xs shadow-xs group-hover:rotate-3 transition-transform">
                {getInitials(activeOwner?.name)}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm tracking-tight text-zinc-900 truncate">
                  {activeOwner?.name || 'Portfolio'}
                </div>
                <div className="text-[11px] text-zinc-500">Portfolio Workspace</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-yellow-50 hover:text-zinc-900 active:scale-95 transition"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Portfolio Navigation */}
          <div className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Showcase
            </p>
            {[
              { id: 'overview', label: 'Overview', icon: LayoutGrid },
              { id: 'projects', label: 'Projects', icon: FolderKanban },
              { id: 'contact', label: 'Contact', icon: Mail },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === 'user' && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpTo('user', item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'bg-yellow-400 text-zinc-950 font-semibold shadow-xs'
                      : 'text-zinc-600 hover:bg-yellow-50 hover:text-zinc-900 hover:translate-x-0.5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Creator Studio */}
          {currentUser && (
            <div className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Creator Studio
              </p>
              <button
                type="button"
                onClick={() => {
                  setActivePortfolioUserId(currentUser.id);
                  jumpTo('studio');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] ${
                  activeTab === 'studio'
                    ? 'bg-yellow-400 text-zinc-950 font-semibold shadow-xs'
                    : 'text-zinc-700 hover:bg-yellow-50 hover:text-zinc-900 hover:translate-x-0.5'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>My Portfolio Studio</span>
              </button>
            </div>
          )}

          {/* Published Portfolios Directory */}
          <div className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
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
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-yellow-100 text-zinc-950 border border-yellow-300 font-semibold'
                        : 'text-zinc-600 hover:bg-stone-100 hover:text-zinc-900'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-yellow-400 text-zinc-950'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
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
        <div className="p-4 shrink-0 border-t border-zinc-200 bg-stone-50/80">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-yellow-400 border border-yellow-500/40 flex items-center justify-center text-xs font-bold text-zinc-950 shrink-0">
                  {getInitials(currentUser.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 truncate">{currentUser.name}</p>
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
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-yellow-100 active:scale-95 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] px-3 py-2.5 text-xs font-bold text-zinc-950 shadow-xs transition-all"
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
        <header className="sticky top-0 z-30 h-14 border-b border-zinc-200 bg-white/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-yellow-50 hover:text-zinc-950 active:scale-95 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-semibold text-zinc-900">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
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
                className="rounded-xl border border-zinc-300 bg-white hover:bg-yellow-50 hover:border-yellow-400 active:scale-[0.98] px-3.5 py-1.5 text-xs font-semibold text-zinc-900 transition-all"
              >
                {activeTab === 'studio' ? 'View Live Portfolio' : 'Edit My Portfolio'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-xs transition-all"
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
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-yellow-400 bg-white px-4 py-3 text-xs font-semibold text-zinc-900 shadow-xl animate-modal-in"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
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