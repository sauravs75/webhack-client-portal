# WebHack Solutions — Client Portal

A production-grade client portal (not an admin panel) built with React + Vite + Tailwind + shadcn/ui + Supabase.

This repo is being built **module by module**. This first drop is **Module 1: Project Setup & Architecture**.

---

## ✅ Module 1 — What's included

- Vite + React 18 project scaffold
- Tailwind CSS configured with shadcn/ui design tokens (light + dark mode CSS variables)
- Feature-based folder architecture (`src/features`, `src/components`, `src/hooks`, etc.)
- Supabase client singleton (`src/supabase/client.js`)
- `cn()` utility + formatting helpers (`src/lib/utils.js`)
- `ThemeContext` (dark mode) — fully working
- `AuthContext` — placeholder, will be completed in Module 2
- Path alias `@/` → `src/`
- `components.json` so the shadcn/ui CLI works immediately

## 🗂 Folder structure

```
src/
  components/
    ui/          → shadcn/ui primitives (button, card, input, etc.)
    common/       → shared building blocks (EmptyState, Skeletons, etc.)
    layout/       → Sidebar, Topbar, DashboardLayout
  features/       → one folder per module (auth, projects, tasks, documents, ...)
  layouts/        → route-level layouts (AuthLayout, DashboardLayout)
  pages/          → route pages
  hooks/          → shared custom hooks
  contexts/       → AuthContext, ThemeContext
  services/       → API/service layer wrapping supabase calls
  supabase/       → supabase client + generated types
  lib/            → utils, constants
  types/           → JSDoc/type defs
  utils/          → misc helpers
  assets/
```

---

## 🚀 Run this in VS Code — step by step

### 1. Open the folder
Unzip the project and open the folder in VS Code:
```bash
code webhack-client-portal
```

### 2. Install recommended extensions (optional but helpful)
- ES7+ React/Redux snippets
- Tailwind CSS IntelliSense
- Prettier

### 3. Install dependencies
Open the VS Code integrated terminal (`` Ctrl+` ``) and run:
```bash
npm install
```

### 4. Create your Supabase project
1. Go to https://supabase.com → New Project
2. Copy your **Project URL** and **anon public key** from Project Settings → API

### 5. Set up environment variables
```bash
cp .env.example .env
```
Then paste your Supabase credentials into `.env`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 6. Run the dev server
```bash
npm run dev
```
Visit **http://localhost:5173** — you should see the placeholder landing screen confirming the scaffold works.

### 7. (Optional) Install shadcn/ui components as we need them
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```
We'll tell you exactly which components to add in each module.

---

## 📍 Roadmap (modules to come — one at a time, waiting for your confirmation)

1. ✅ **Project Setup & Architecture** (this drop)
2. ⬜ Supabase SQL Schema + RLS Policies
3. ⬜ Authentication (login, signup, forgot/reset password, email verification, protected routes)
4. ⬜ Dashboard Layout + Sidebar/Topbar + Dashboard Home
5. ⬜ Projects Module
6. ⬜ Tasks Module
7. ⬜ Documents Module (Supabase Storage)
8. ⬜ Meetings Module
9. ⬜ Notifications (Realtime)
10. ⬜ Support Tickets
11. ⬜ Billing / Invoices
12. ⬜ Profile
13. ⬜ Settings

Say **"continue"** or **"next module"** whenever you're ready, and we'll build the next one on top of this foundation.
