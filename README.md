# Sampreeth Bunga - Portfolio (React + Vite)

A modern Personal Portfolio & Project Showcase application built with **React**, **Vite**, and **Tailwind CSS**. Includes role-based access control (Admin & User modules), project dynamic filtering, contact submission handling, and persistent data operations managed through `localStorage`.

## 🚀 Features

- **React + Vite Framework**: Fast HMR and lightweight optimized bundle built for production.
- **User Module**: Dynamic project showcase filtering (Frontend, Backend, Full Stack), user contact inquiry submissions.
- **Admin Module**: Restricted dashboard hidden from non-admin users. Complete CRUD operations (Add, Edit, Delete projects) and Inquiry inbox.
- **Authentication**: LocalStorage login and signup workflow supporting `user` and `admin` roles.
- **Vercel Ready**: Includes `vercel.json` rewrite configuration for seamless Single Page Application deployment.

## 🛠️ Demo Credentials (Seeded automatically)

- **Admin Account**: `admin@portfolio.com` | Password: `admin123`
- **User Account**: `user@portfolio.com` | Password: `user123`

## 📦 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Keep framework preset as **Vite** (Build command: `npm run build`, Output directory: `dist`).
5. Click **Deploy**.
