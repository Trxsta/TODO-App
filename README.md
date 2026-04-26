# TODO App

A clean, mobile-first Todo app built with React. Designed from a Figma prototype and deployed on Netlify.

---

## What it does

- **Add tasks** — open the modal, enter a name, optional description, and an optional deadline
- **Complete tasks** — tap the checkbox to mark a task done (or undo it)
- **Delete tasks** — tap the trash icon; the task animates out before disappearing
- **Filter tasks** — switch between All, Active, and Completed tabs
- **Search tasks** — type in the search bar to filter by name or description
- **Progress bar** — tracks how many tasks you've completed out of the total
- **Overdue badges** — any task past its deadline shows a red "Overdue" pill
- **Persists on refresh** — tasks are saved to your browser's localStorage

---

## Tech stack

- [React](https://react.dev) — UI
- [Vite](https://vitejs.dev) — build tool and dev server
- Plain CSS — no CSS framework

---

## How to run it locally

You need [Node.js](https://nodejs.org) installed (version 18 or higher).

**1. Clone the repo**

```bash
git clone https://github.com/Trxsta/TODO-App.git
cd TODO-App
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the dev server**

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to build for production

```bash
npm run build
```

This creates a `dist/` folder with the compiled app ready to deploy.

---

## How to deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and log in
2. Click **Add new site → Import from Git**
3. Connect your GitHub and select this repo
4. Netlify will auto-detect the settings from `netlify.toml` — just click **Deploy**

The build command is `npm run build` and the publish folder is `dist`.

---

## Project structure

```
src/
  App.jsx      — all components and logic
  App.css      — all styles
  index.css    — base reset
```
