import { SpeedInsights } from '@vercel/speed-insights/react';
import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import UserModule from './components/UserModule';
import AdminModule from './components/AdminModule';
import AuthModal from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('user');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          openAuthModal={() => setIsAuthModalOpen(true)}
          showToast={showToast}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {activeTab === 'user' ? (
            <UserModule
              showToast={showToast}
              onSwitchToAdmin={() => handleTabChange('admin')}
            />
          ) : (
            <AdminModule
              showToast={showToast}
              onSwitchToUser={() => handleTabChange('user')}
            />
          )}
        </main>

        <footer className="border-t border-slate-800/80 bg-slate-950/90 py-5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>Sampreeth Bunga — Interactive Portfolio Showcase</span>
            <span>Built with React, Vite &amp; Tailwind CSS</span>
          </div>
        </footer>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-700/90 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-2xl backdrop-blur-md"
          >
            {toast.type === 'info' ? (
              <Info className="h-4 w-4 shrink-0 text-indigo-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          showToast={showToast}
        />
        <SpeedInsights />
      </div>
    </AuthProvider>
  );
}