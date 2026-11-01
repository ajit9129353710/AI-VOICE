import { Bell, Sparkles } from "lucide-react";

export default function Navbar({ title = "VoxMate AI" }) {
return (
<header className="vm-navbar">
<div className="vm-navbar-title">
<div className="vm-navbar-logo">
<Sparkles size={21} />
</div>

    <div>
      <h2>{title}</h2>
      <p>Your AI-powered workspace</p>
    </div>
  </div>

  <button
    type="button"
    className="vm-navbar-icon"
    aria-label="Notifications"
    title="Notifications"
  >
    <Bell size={20} />
  </button>
</header>

);
}