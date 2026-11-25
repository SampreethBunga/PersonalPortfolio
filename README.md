# Sampreeth Bunga — Developer Portfolio & Workspace

A frontend portfolio application built with React, Vite, and Tailwind CSS. It combines a visitor-facing project showcase with an interactive workspace dashboard and a role-gated administrative view.

## Live Demo

- **Production URL:** https://personal-portfolio-lac-omega.vercel.app/

## Overview

Most developer portfolios present static project cards that require visitors to navigate away to understand technical scope or implementation details. This application organizes projects into an interactive workspace with summary metrics, category and technology breakdowns, in-context case-study modals, and a streamlined inquiry workflow.

## Features

- **Workspace Analytics:** Displays total project counts, distinct technologies, category distribution via an SVG donut chart, and horizontal progress bars for most-used tools.
- **Interactive Project Showcase:** Supports category filtering (`All`, `Frontend`, `Backend`, `Full Stack`) with live item counts and clickable project cards that open a structured detail modal (problem statement, solution, key highlights, tech stack, and external links).
- **Role-Based Navigation:** Provides a persistent sidebar with section navigation and separate User and Admin views.
- **Contact & Admin Management:** Integrates asynchronous form submissions via Web3Forms with toast feedback, alongside an Admin Dashboard to add, edit, or remove projects and review or clear submitted inquiries.

## Tech Stack

- **Framework & Build Tool:** React, Vite
- **Styling & Icons:** Tailwind CSS, Lucide React
- **Integrations & Hosting:** Web3Forms, Vercel, Vercel Speed Insights

## Project Structure

```text
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── context/
    │   └── AuthContext.jsx
    └── components/
        ├── UserModule.jsx
        ├── AdminModule.jsx
        └── AuthModal.jsx