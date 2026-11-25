import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Code2, LogOut, User as UserIcon, ShieldAlert, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, openAuthModal }) {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      setActiveTab('user');
    }
  }, [activeTab, currentUser, setActiveTab]);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setActiveTab('user');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleSelectTab('user')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-lg sm:text-xl transition-colors"
        >
          <Code2 className="w-6 h-6 shrink-0" />
          <span>Sampreeth Bunga</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleSelectTab('user')}
            className={`font-medium transition-colors py-1 ${
              activeTab === 'user'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Portfolio
          </button>

          {currentUser && currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleSelectTab('admin')}
              className={`font-medium transition-colors py-1 ${
                activeTab === 'admin'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin Dashboard
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-sm text-slate-200 flex items-center gap-1.5">
                {currentUser.role === 'admin' ? (
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                )}
                <strong>{currentUser.name}</strong>
                <span className="text-xs text-slate-400">({currentUser.role})</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors p-1"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => handleSelectTab('user')}
              className={`text-left px-3 py-2 rounded-lg font-medium transition ${
                activeTab === 'user'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Portfolio
            </button>

            {currentUser && currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleSelectTab('admin')}
                className={`text-left px-3 py-2 rounded-lg font-medium transition ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Admin Dashboard
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800">
            {currentUser ? (
              <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-sm text-slate-200 flex items-center gap-2">
                  {currentUser.role === 'admin' ? (
                    <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                  )}
                  <strong>{currentUser.name}</strong> ({currentUser.role})
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}