import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'user_sampreeth',
    name: 'Sampreeth Bunga',
    email: 'admin@portfolio.com',
    password: 'password123',
    role: 'admin',
    headline: 'Computer Science & Engineering Student | Full Stack & Systems Developer',
    bio: 'Building clean web interfaces, algorithmic tools, and real-time embedded systems.',
    location: 'India',
  },
];

const DEFAULT_PORTFOLIOS = {
  user_sampreeth: [
    {
      id: 201,
      title: 'Student Management & Grade Calculator',
      category: 'Frontend',
      description:
        'React + Vite web application with automated grade/GPA calculation and clean student record views.',
      problem:
        'Calculating course outcomes and student grades across entries manually is slow and prone to arithmetic slips.',
      solution:
        'Built a fast React interface with Math-based grade computation, instant state updates, and responsive layouts.',
      highlights: [
        'Automated grade and GPA calculation using deterministic logic',
        'Clean component layout with zero page reloads',
      ],
      tech: ['React', 'Vite', 'JavaScript', 'Tailwind CSS'],
      githubUrl: 'https://github.com',
      liveUrl: '',
    },
    {
      id: 202,
      title: 'Minimalist Multi-User Portfolio Workspace',
      category: 'Full Stack',
      description:
        'Multi-user portfolio platform allowing creators to sign up, customize their profile, and publish projects.',
      problem:
        'Developers need a distraction-free workspace to showcase builds and inspect case studies without heavy setup.',
      solution:
        'Built a monochrome workspace with per-user authentication, live stack telemetry, and modal case studies.',
      highlights: [
        'Per-user authentication with isolated project catalogs',
        'Minimalist monochrome UI with dynamic stack analytics',
      ],
      tech: ['React', 'Tailwind CSS', 'Vite', 'Vercel'],
      githubUrl: 'https://github.com',
      liveUrl: '',
    },
    {
      id: 203,
      title: 'STM32 Real-Time Patient Health Monitor',
      category: 'Backend',
      description:
        'Embedded firmware workflow on STM32 NUCLEO-F401RE / F446RE for acquiring physiological readings and flagging alerts.',
      problem:
        'Raw sensor readings require real-time unit scaling and threshold checks without blocking deterministic execution.',
      solution:
        'Implemented structured timer/peripheral sampling and calibration scaling operations on STM32 Nucleo hardware.',
      highlights: [
        'Targeted STM32 NUCLEO-F401RE and F446RE development boards',
        'Accurate sensor calibration scaling for readable vitals',
      ],
      tech: ['Embedded C', 'STM32 Nucleo', 'ADC', 'Hardware'],
      githubUrl: 'https://github.com',
      liveUrl: '',
    },
  ],
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [portfolios, setPortfolios] = useState({});
  const [activePortfolioUserId, setActivePortfolioUserId] = useState('user_sampreeth');

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('app_users')) || DEFAULT_USERS;
    const storedPortfolios =
      JSON.parse(localStorage.getItem('app_portfolios')) || DEFAULT_PORTFOLIOS;
    const savedSessionId = localStorage.getItem('app_session_user_id');

    if (!localStorage.getItem('app_users')) {
      localStorage.setItem('app_users', JSON.stringify(storedUsers));
    }
    if (!localStorage.getItem('app_portfolios')) {
      localStorage.setItem('app_portfolios', JSON.stringify(storedPortfolios));
    }

    setUsers(storedUsers);
    setPortfolios(storedPortfolios);

    if (savedSessionId) {
      const found = storedUsers.find((u) => u.id === savedSessionId);
      if (found) {
        setCurrentUser(found);
        setActivePortfolioUserId(found.id);
      }
    }
  }, []);

  const persistUsers = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem('app_users', JSON.stringify(nextUsers));
  };

  const persistPortfolios = (nextPortfolios) => {
    setPortfolios(nextPortfolios);
    localStorage.setItem('app_portfolios', JSON.stringify(nextPortfolios));
  };

  const login = (email, password) => {
    const normalized = email.trim().toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password
    );
    if (!matched) {
      return { success: false, message: 'Invalid email or password.' };
    }
    setCurrentUser(matched);
    setActivePortfolioUserId(matched.id);
    localStorage.setItem('app_session_user_id', matched.id);
    return { success: true, user: matched };
  };

  const signup = ({ name, email, password, headline }) => {
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: normalized,
      password,
      role: 'creator',
      headline: headline?.trim() || 'Developer & Builder',
      bio: 'Welcome to my minimalist portfolio workspace.',
      location: '',
    };

    const nextUsers = [...users, newUser];
    const nextPortfolios = {
      ...portfolios,
      [newUser.id]: [],
    };

    persistUsers(nextUsers);
    persistPortfolios(nextPortfolios);
    setCurrentUser(newUser);
    setActivePortfolioUserId(newUser.id);
    localStorage.setItem('app_session_user_id', newUser.id);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_session_user_id');
  };

  const updateUserProfile = (userId, updates) => {
    const nextUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    persistUsers(nextUsers);
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const saveUserProjects = (userId, nextProjectList) => {
    const nextPortfolios = {
      ...portfolios,
      [userId]: nextProjectList,
    };
    persistPortfolios(nextPortfolios);
  };

  const activeOwner =
    users.find((u) => u.id === activePortfolioUserId) || users[0] || DEFAULT_USERS[0];
  const activeProjects = portfolios[activeOwner?.id] || [];

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        activeOwner,
        activeProjects,
        activePortfolioUserId,
        setActivePortfolioUserId,
        login,
        signup,
        logout,
        updateUserProfile,
        saveUserProjects,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}