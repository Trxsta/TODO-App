import { useState, useEffect } from 'react';
import './App.css';

const initialTasks = [
  { id: 1, name: 'Task 1', description: 'Assignment 1 & 2',        deadline: '03/01', completed: true,  time: '8m ago' },
  { id: 2, name: 'Task 2', description: 'Grocery list (see more)', deadline: '03/02', completed: false, time: '8m ago' },
  { id: 3, name: 'Task 3', description: 'Doctors appointment',     deadline: '03/05', completed: true,  time: '8m ago' },
  { id: 4, name: 'Task 4', description: 'Birthday party',          deadline: '03/10', completed: false, time: '8m ago' },
];

function timeAgo() {
  return 'just now';
}

function isOverdue(deadline) {
  if (!deadline) return false;
  const [month, day] = deadline.split('/').map(Number);
  const due = new Date(new Date().getFullYear(), month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function TaskItem({ task, deleting, onToggle, onDelete }) {
  return (
    <div className={`task-item${task.completed ? ' completed' : ''}${deleting ? ' deleting' : ''}`}>
      <button
        className="task-checkbox"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="task-body">
        <div className="task-row">
          <span className="task-name">{task.name}</span>
          {task.deadline && (
            <span className={`task-deadline${!task.completed && isOverdue(task.deadline) ? ' overdue' : ''}`}>
              {!task.completed && isOverdue(task.deadline) ? 'Overdue' : task.deadline}
            </span>
          )}
        </div>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      <div className="task-meta-right">
        <span className="task-time">{task.time}</span>
        <button className="task-delete" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <svg width="15" height="16" viewBox="0 0 15 16" fill="none">
            <path d="M1 4H14M5.5 4V2.5H9.5V4M6 7.5V12M9 7.5V12M2.5 4L3.5 13.5H11.5L12.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function AddTaskModal({ onClose, onAdd }) {
  const [name, setName]         = useState('');
  const [desc, setDesc]         = useState('');
  const [deadline, setDeadline] = useState('');

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ name: trimmed, description: desc.trim(), deadline });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-back" onClick={onClose}>Back</button>
          <span className="modal-title">Add New Task</span>
          <button className="modal-save" onClick={handleSave}>Save</button>
        </div>
        <div className="modal-body">
          <p className="modal-hint">Write something...</p>
          <div className="modal-field">
            <label>Task Name:</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label>Insert Description:</label>
            <textarea
              className="modal-textarea"
              placeholder="Add a description..."
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Set Deadline:</label>
            <div className="deadline-row">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M1 6.5H15" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 1V4M11 1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('todo-tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [showModal, setShowModal]     = useState(false);
  let nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  function addTask({ name, description, deadline }) {
    const formatted = deadline
      ? new Date(deadline + 'T00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
      : '';
    setTasks((prev) => [
      ...prev,
      { id: nextId++, name, description, deadline: formatted, completed: false, time: timeAgo() },
    ]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id) {
    if (deletingIds.has(id)) return;
    setDeletingIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 320);
  }

  const filtered = tasks
    .filter((t) => {
      if (filter === 'active')    return !t.completed;
      if (filter === 'completed') return  t.completed;
      return true;
    })
    .filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
    );

  const emptyMessage =
    filter === 'completed' ? 'No completed tasks yet.' :
    filter === 'active'    ? 'All caught up!' :
                             'No tasks found.';

  return (
    <div className="app-shell">
      <div className="phone">

        <header className="app-header">
          <h1 className="app-title">Welcome Tristan!</h1>
          <p className="app-subtitle">
            {tasks.filter((t) => !t.completed).length} task{tasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} remaining
          </p>
          {tasks.length > 0 && (
            <div className="progress-wrap">
              <div
                className="progress-bar"
                style={{ width: `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}%` }}
              />
            </div>
          )}
        </header>

        <div className="search-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search Tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab${filter === tab ? ' active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filtered.length === 0 && (
            <p className="empty-state">{emptyMessage}</p>
          )}
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              deleting={deletingIds.has(task.id)}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          <span className="add-icon">＋</span>
          Add New Task
        </button>

        <nav className="bottom-nav">
          <button className="nav-btn active" aria-label="Home">🏠</button>
        </nav>

        {showModal && (
          <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />
        )}
      </div>
    </div>
  );
}
