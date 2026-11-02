import { useEffect, useState } from "react";
import {
Bot,
CheckCircle2,
Circle,
FileText,
ListTodo,
ArrowRight,
Sparkles,
Clock,
Plus,
Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
const [tasks, setTasks] = useState([]);
const [notes, setNotes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const loadDashboard = async () => {
try {
const [taskResponse, noteResponse] = await Promise.all([
api.get("/api/tasks"),
api.get("/api/notes"),
]);

    setTasks(taskResponse.data.tasks || []);
    setNotes(noteResponse.data.notes || []);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Dashboard data load nahi ho saka."
    );
  } finally {
    setLoading(false);
  }
};

loadDashboard();

}, []);

const completedTasks = tasks.filter((task) => task.completed).length;
const pendingTasks = tasks.length - completedTasks;

const recentTasks = [...tasks].slice(-4).reverse();
const recentNotes = [...notes].slice(-3).reverse();

const firstName = JSON.parse(
localStorage.getItem("voxmate_user") || "null"
)?.name?.split(" ")[0] || "User";

return (
<div className="dashboard-page">
<Sidebar />

  <main className="dashboard-main">
    <Navbar title="Dashboard" />

    <header className="dashboard-header">
      <div>
        <p className="welcome-label">YOUR PERSONAL WORKSPACE</p>
        <h1>Welcome back, {firstName}! 👋</h1>
        <p className="header-description">
          Manage your tasks, notes and AI conversations in one place.
        </p>
      </div>

      <div className="header-status">
        <span className="status-dot"></span>
        Workspace Active
      </div>
    </header>

    {error && <p className="error-message">{error}</p>}

    <section className="welcome-banner">
      <div className="banner-content">
        <span className="banner-tag">
          <Sparkles size={15} /> YOUR AI PRODUCTIVITY PARTNER
        </span>

        <h2>Think smarter. Get more done.</h2>

        <p>
          Ask your AI assistant questions, organize your work,
          and keep your important ideas in one place.
        </p>

        <Link to="/assistant" className="banner-button">
          Talk to AI <ArrowRight size={18} />
        </Link>
      </div>

      <div className="banner-visual">
        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>

        <div className="ai-core">
          <Bot size={54} />
        </div>

        <Sparkles className="banner-sparkle sparkle-one" size={25} />
        <Sparkles className="banner-sparkle sparkle-two" size={18} />
      </div>
    </section>

    <section className="stats-section">
      <div className="section-heading">
        <div>
          <h2>Your Overview</h2>
          <p>Your current productivity at a glance.</p>
        </div>

        <span className="live-badge">
          <span className="status-dot"></span>
          Live Data
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-purple">
          <div className="stat-top">
            <span>Total Tasks</span>
            <ListTodo size={22} />
          </div>
          <h3>{loading ? "..." : tasks.length}</h3>
          <p>All your tasks</p>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-top">
            <span>Completed</span>
            <CheckCircle2 size={22} />
          </div>
          <h3>{loading ? "..." : completedTasks}</h3>
          <p>Tasks finished</p>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-top">
            <span>Pending</span>
            <Clock size={22} />
          </div>
          <h3>{loading ? "..." : pendingTasks}</h3>
          <p>Tasks remaining</p>
        </div>

        <div className="stat-card stat-blue">
          <div className="stat-top">
            <span>Total Notes</span>
            <FileText size={22} />
          </div>
          <h3>{loading ? "..." : notes.length}</h3>
          <p>Saved notes</p>
        </div>
      </div>
    </section>

    <section className="quick-actions-section">
      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Jump straight into your work.</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        <Link to="/tasks" className="action-card">
          <div className="action-icon action-purple">
            <Plus size={23} />
          </div>
          <div>
            <h3>Create a Task</h3>
            <p>Add and manage your daily tasks.</p>
          </div>
          <ArrowRight size={19} className="action-arrow" />
        </Link>

        <Link to="/notes" className="action-card">
          <div className="action-icon action-blue">
            <FileText size={23} />
          </div>
          <div>
            <h3>Write a Note</h3>
            <p>Save ideas and important information.</p>
          </div>
          <ArrowRight size={19} className="action-arrow" />
        </Link>

        <Link to="/assistant" className="action-card">
          <div className="action-icon action-pink">
            <Bot size={23} />
          </div>
          <div>
            <h3>Ask AI Assistant</h3>
            <p>Get help with questions and ideas.</p>
          </div>
          <ArrowRight size={19} className="action-arrow" />
        </Link>
      </div>
    </section>

    <section className="recent-grid">
      <div className="recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Tasks</h2>
            <p>Your latest task activity.</p>
          </div>

          <Link to="/tasks" className="view-all">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="panel-message">Loading tasks...</p>
        ) : recentTasks.length === 0 ? (
          <div className="panel-empty">
            <ListTodo size={30} />
            <p>No tasks yet.</p>
            <Link to="/tasks">Create your first task</Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentTasks.map((task) => (
              <div className="recent-item" key={task._id}>
                {task.completed ? (
                  <CheckCircle2 className="task-done-icon" size={20} />
                ) : (
                  <Circle className="task-pending-icon" size={20} />
                )}

                <div className="recent-item-content">
                  <strong
                    className={task.completed ? "recent-completed" : ""}
                  >
                    {task.title}
                  </strong>
                  <span>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Notes</h2>
            <p>Your latest saved ideas.</p>
          </div>

          <Link to="/notes" className="view-all">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="panel-message">Loading notes...</p>
        ) : recentNotes.length === 0 ? (
          <div className="panel-empty">
            <FileText size={30} />
            <p>No notes yet.</p>
            <Link to="/notes">Write your first note</Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentNotes.map((note) => (
              <div className="recent-item note-recent-item" key={note._id}>
                <FileText size={20} className="note-recent-icon" />

                <div className="recent-item-content">
                  <strong>{note.title}</strong>
                  <span>
                    {note.content?.slice(0, 65) || "Saved note"}
                    {note.content?.length > 65 ? "..." : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

    <footer className="dashboard-footer">
      <span>© {new Date().getFullYear()} VoxMate AI</span>
      <span>Built for smarter productivity ✨</span>
    </footer>
  </main>
</div>

);
}