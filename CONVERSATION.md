# Build Transcript — TODO App

This is a record of the iterative conversation used to design and build this app using Claude Code.

---

## Step 1 — Planning from the Figma

**Me:** I have a Figma prototype for a mobile Todo app. Help me break it down into core UI components, state structure, and an MVP feature list. Keep it simple — 1–2 hour project.

**Claude:** Broke the app down into:
- Components: Header, TaskList, TaskItem, AddTaskInput, EmptyState
- State: `tasks: [{ id, text, completed, createdAt }]`
- MVP features: add, complete, delete, filter (All/Active/Completed), localStorage

---

## Step 2 — Reviewing the Figma screens

**Me:** *(shared the Figma PDF)*

**Claude:** Updated the plan based on the actual screens:
- 5 screens identified: Sign Up, Log In, Home (task list), Add New Task modal, Profile
- Color scheme noted: purple `#7C3AED` accent, white cards, clean sans-serif type
- Task items have: checkbox, task name, deadline badge, timestamp, delete button
- Profile screen already shows "All Tasks / Completed" tab pattern

---

## Step 3 — Scaffolding the UI

**Me:** Generate a React component for a mobile-first Todo app UI. Clean layout, header, input, task list, basic styling. No logic yet.

**Claude:**
- Ran `npm create vite@latest todo-app -- --template react`
- Wrote `App.jsx` with three components: `App`, `TaskItem`, `AddTaskModal`
- Wrote `App.css` with CSS variables, phone-frame shell, mobile-first layout
- Used mock task data so the UI had something to show
- Started dev server

**Issue:** The dev server started on port 5173, which was already taken by the Travel Wishlist site.

**Fix:** Restarted on port 5174 with `npm run dev -- --port 5174`.

---

## Step 4 — Adding functionality

**Me:** Add task, mark complete, delete task, update UI instantly. Keep state simple (useState is fine).

**Claude:**
- Changed `const [tasks] = useState(mockTasks)` to `const [tasks, setTasks] = useState(...)`
- Added `addTask`, `toggleTask`, `deleteTask` functions
- Wired modal Save button and Enter key to `addTask`
- Wired checkbox to `toggleTask`
- Wired trash icon to `deleteTask`
- All updates use immutable patterns (`map`, `filter`) so React re-renders correctly

---

## Step 5 — UI polish + Netlify config

**Me:** Make the app deployable on Netlify and refine the UI to better match the Figma. Focus on spacing, font sizes, colors, button styling, mobile layout.

**Claude:**
- Created `netlify.toml` with `build command: npm run build` and `publish: dist`
- Rewrote `App.css` with refined design tokens and improved layout:
  - Phone frame with 44px border radius and soft shadow
  - Header: 26px/800 weight title + muted subtitle
  - Search bar: pill shape with SVG magnifier icon
  - Task deadline: small purple pill badge
  - Checkbox: SVG checkmark path instead of text character
  - Delete button: SVG trash icon instead of emoji (consistent across all OSes)
  - "Add New Task" button: circular icon that fills purple on hover
  - Modal: drag handle bar, pill-shaped Save button, calendar icon for deadline
- Ran `npm run build` — passed clean

---

## Step 6 — localStorage persistence

**Me:** Add localStorage so tasks persist after refresh. Clean implementation.

**Claude:**
- Imported `useEffect`
- Replaced `useState(initialTasks)` with a lazy initializer that reads `localStorage.getItem('todo-tasks')` on mount, falling back to `initialTasks` if nothing is saved yet
- Added `useEffect(() => { localStorage.setItem(...) }, [tasks])` to sync on every change
- `try/catch` in the initializer handles corrupted JSON without crashing

---

## Step 7 — Filter tabs

**Me:** Suggest one small but impressive feature under 30 minutes. Then implement it.

**Claude:** Recommended **filter tabs (All / Active / Completed)** — already in the Figma profile screen, real utility, ~10 minutes.

**Implemented:**
- Added `filter` state: `'all' | 'active' | 'completed'`
- Added three tab buttons between search bar and task list
- Updated the filtered task list to apply the active filter before the search filter
- Context-aware empty states: "All caught up!" for Active, "No completed tasks yet." for Completed
- Active tab gets a purple underline matching the Figma design

---

## Step 8 — Three polish improvements

**Me:** Give me 3 quick UI polish improvements for a production-ready feel. Under 20–30 minutes each.

**Claude suggested:**
1. Smooth delete animation
2. Completion progress bar
3. Overdue badge

**Me:** Do them one by one, check for errors as you go.

---

### 8a — Smooth delete animation

- Added `deletingIds` Set to state
- On delete: add id to set, trigger CSS animation, remove from tasks after 320ms
- CSS: `slideOut` keyframe slides right + fades + collapses height via `max-height`
- Guard: `if (deletingIds.has(id)) return` prevents double-firing on fast clicks
- Build passed clean ✓

### 8b — Completion progress bar

- Added a thin bar inside the header
- Width calculated as `(completedCount / totalCount) * 100%`
- CSS transition: `width 0.4s cubic-bezier(0.4, 0, 0.2, 1)` for smooth fill
- Hidden entirely when task list is empty (no empty gray track)
- Build passed clean ✓

### 8c — Overdue badge

- Added `isOverdue(deadline)` helper — parses `MM/DD` string, compares to today
- Badge turns red and reads "Overdue" for past-due, incomplete tasks
- Completed tasks never show Overdue (marking done clears it immediately)
- Build passed clean ✓

---

## Step 9 — Bug check before commit

**Me:** Check for bugs twice, then commit and push. Create a new repo called "TODO App."

**Claude audited both files and found one bug:**

`t.description.toLowerCase()` in the search filter would throw if a task loaded from localStorage was missing a `description` field (e.g. data saved by an older version of the app).

**Fix:** `(t.description || '').toLowerCase()`

**Build passed clean ✓**

---

## Step 10 — Git and GitHub

- Ran `git init`, staged all files, committed
- Ran `gh repo create "TODO App" --public` — repo created under `TrizJS` (wrong account)
- Push failed: credential conflict between `TrizJS` (gh CLI) and `Trxsta` (git credential manager)
- Fixed push with `gh auth setup-git`, then pushed successfully

**Me:** I wanted it pushed to my Trxsta account, not TrizJS.

**Claude:**
- Ran `gh auth switch --user Trxsta`
- Could not delete `TrizJS/TODO-App` (token missing `delete_repo` scope)
- Discovered `Trxsta/TODO-App` already existed (empty)
- Updated remote URL to `https://github.com/Trxsta/TODO-App.git`
- Ran `gh auth setup-git` again to wire Trxsta credentials into git
- Pushed successfully

**Final repo:** https://github.com/Trxsta/TODO-App

---

## Final file list

| File | Purpose |
|---|---|
| `src/App.jsx` | All components: App, TaskItem, AddTaskModal |
| `src/App.css` | All styles and animations |
| `src/index.css` | Base reset only |
| `netlify.toml` | Netlify build config |
| `README.md` | Setup and usage guide |
| `CONVERSATION.md` | This file |

## Summary

This transcript shows how the app evolved through a structured, step-by-step build process starting from a Figma prototype and turning it into a fully functional React Todo app. AI was heavily used for scaffolding components, wiring up state logic, and iterating quickly on features like task CRUD, filtering, animations, and localStorage persistence. It also helped handle real-world dev friction like port conflicts, GitHub auth issues, and edge-case bugs, but the key takeaway is that most of the progress came from continuously reviewing AI output, correcting assumptions, and making deliberate decisions about what complexity was actually worth keeping.
