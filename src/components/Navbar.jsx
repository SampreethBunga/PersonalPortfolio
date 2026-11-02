import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Code2, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, openAuthModal }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xl cursor-pointer" onClick={() => setActiveTab('user')}>
          <Code2 className="w-6 h-6" />
          <span>Sampreeth Bunga</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('user')}
            className={`font-medium transition-colors ${activeTab === 'user' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-300 hover:text-white'}`}
          >
            Portfolio
          </button>

          {/* Admin Dashboard tab - Strictly visible ONLY for admin role */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`font-medium transition-colors ${activeTab === 'admin' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-300 hover:text-white'}`}
            >
              Admin Dashboard
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-sm text-slate-300 flex items-center gap-1.5">
                {currentUser.role === 'admin' ? <ShieldAlert className="w-4 h-4 text-indigo-400" /> : <UserIcon className="w-4 h-4 text-emerald-400" />}
                <strong>{currentUser.name}</strong> ({currentUser.role})
              </span>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
