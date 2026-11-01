import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export default function TaskCard({ task, onToggle, onDelete }) {
return (
<div
className={`vm-task-card ${task.completed ? "completed" : ""}`}>
<button
type="button"
className="vm-task-check"
onClick={() => onToggle(task._id)}
title={task.completed ? "Mark as pending" : "Mark as completed"}
>
{task.completed ? (
<CheckCircle2 size={22} />
) : (
<Circle size={22} />
)}
</button>

  <div className="vm-task-content">
    <h3>{task.title}</h3>

    {task.description && <p>{task.description}</p>}

    <span className="vm-task-status">
      {task.completed ? "Completed" : "Pending"}
    </span>
  </div>

  <button
    type="button"
    className="vm-task-delete"
    onClick={() => onDelete(task._id)}
    title="Delete task"
  >
    <Trash2 size={18} />
  </button>
</div>

);
}