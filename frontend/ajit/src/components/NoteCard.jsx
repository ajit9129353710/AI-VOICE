import { StickyNote, Trash2 } from "lucide-react";

export default function NoteCard({ note, onDelete }) {
return (
<article className="vm-note-card">
<div className="vm-note-header">
<div className="vm-note-icon">
<StickyNote size={20} />
</div>

    <button
      type="button"
      className="vm-note-delete"
      onClick={() => onDelete(note._id)}
      aria-label="Delete note"
    >
      <Trash2 size={18} />
    </button>
  </div>

  <h3>{note.title}</h3>

  <p className="vm-note-content">{note.content}</p>

  <div className="vm-note-footer">
    {note.createdAt
      ? new Date(note.createdAt).toLocaleDateString()
      : "Recently created"}
  </div>
</article>

);
}