import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import api from "../services/api";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);

const fetchTasks = async () => {
try {
const response = await api.get("/api/tasks");
setTasks(response.data.tasks || []);
setError("");
} catch (err) {
setError(
err.response?.data?.message || "Tasks load nahi ho sake."
);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchTasks();
}, []);

const addTask = async (e) => {
e.preventDefault();

if (!title.trim()) return;

try {
  setSaving(true);
  setError("");

  await api.post("/api/tasks", {
    title: title.trim(),
    description: description.trim(),
  });

  setTitle("");
  setDescription("");
  await fetchTasks();
} catch (err) {
  setError(
    err.response?.data?.message || "Task add nahi hua."
  );
} finally {
  setSaving(false);
}

};

const toggleTask = async (id) => {
const task = tasks.find((item) => item._id === id);
if (!task) return;

try {
  setError("");

  await api.put(`/tasks/${id}`, {
    completed: !task.completed,
  });

  await fetchTasks();
} catch (err) {
  setError(
    err.response?.data?.message || "Task update nahi hua."
  );
}

};

const deleteTask = async (id) => {
try {
setError("");

  await api.delete(`/tasks/${id}`);

  await fetchTasks();
} catch (err) {
  setError(
    err.response?.data?.message || "Task delete nahi hua."
  );
}

};

return (
<div className="page-container">
<header className="topbar">
<Link to="/dashboard" className="back-link">
<ArrowLeft size={18} />
Dashboard
</Link>

    <h2>VoxMate AI</h2>
  </header>

  <main className="content-area">
    <h1>My Tasks</h1>
    <p className="subtitle">
      Apne daily tasks ko manage karo.
    </p>

    <form className="task-form" onSubmit={addTask}>
      <input
        type="text"
        placeholder="Task ka title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <button
        type="submit"
        className="primary-btn"
        disabled={saving}
      >
        <Plus size={18} />
        {saving ? "Adding..." : "Add Task"}
      </button>
    </form>

    {error && <p className="error-message">{error}</p>}

    {loading ? (
      <p>Tasks load ho rahe hain...</p>
    ) : tasks.length === 0 ? (
      <div className="empty-state">
        <h3>Abhi koi task nahi hai</h3>
        <p>Upar form se apna pehla task add karo.</p>
      </div>
    ) : (
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    )}
  </main>
</div>

);
}