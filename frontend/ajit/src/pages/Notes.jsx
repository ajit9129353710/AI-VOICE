import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import api from "../services/api";
import NoteCard from "../components/NoteCard";

export default function Notes() {
const [notes, setNotes] = useState([]);
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const fetchNotes = async () => {
try {
const response = await api.get("/notes");
setNotes(response.data.notes || []);
setError("");
} catch (err) {
setError(
err.response?.data?.message || "Notes load nahi ho sake."
);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchNotes();
}, []);

const addNote = async (e) => {
e.preventDefault();

if (!title.trim() || !content.trim()) {
  setError("Title aur content dono bharo.");
  return;
}

try {
  setSaving(true);
  setError("");

  await api.post("/notes", {
    title: title.trim(),
    content: content.trim(),
  });

  setTitle("");
  setContent("");

  await fetchNotes();
} catch (err) {
  setError(
    err.response?.data?.message || "Note save nahi hua."
  );
} finally {
  setSaving(false);
}

};

const deleteNote = async (id) => {
try {
setError("");

  await api.delete(`/notes/${id}`);

  await fetchNotes();
} catch (err) {
  setError(
    err.response?.data?.message || "Note delete nahi hua."
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
    <h1>My Notes</h1>

    <p className="subtitle">
      Apne important ideas aur notes save karo.
    </p>

    <form className="task-form" onSubmit={addNote}>
      <input
        type="text"
        placeholder="Note ka title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Apna note yahan likho..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        required
      />

      <button
        type="submit"
        className="primary-btn"
        disabled={saving}
      >
        <Plus size={18} />
        {saving ? "Saving..." : "Save Note"}
      </button>
    </form>

    {error && <p className="error-message">{error}</p>}

    {loading ? (
      <p>Notes load ho rahe hain...</p>
    ) : notes.length === 0 ? (
      <div className="empty-state">
        <FileText size={35} />
        <h3>Abhi koi note nahi hai</h3>
        <p>Apna pehla note banane ke liye upar form bharo.</p>
      </div>
    ) : (
      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={deleteNote}
          />
        ))}
      </div>
    )}
  </main>
</div>

);
}