import {
LayoutDashboard,
ListTodo,
FileText,
Bot,
LogOut,
Sparkles,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
const { user, logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
logout();
navigate("/login");
};

const links = [
{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
{ name: "My Tasks", path: "/tasks", icon: ListTodo },
{ name: "My Notes", path: "/notes", icon: FileText },
{ name: "AI Assistant", path: "/assistant", icon: Bot },
];

return (
<aside className="vm-sidebar">
<div className="vm-sidebar-brand">
<div className="vm-brand-icon">
<Sparkles size={23} />
</div>

    <div>
      <h2>VoxMate</h2>
      <span>AI WORKSPACE</span>
    </div>
  </div>

  <div className="vm-sidebar-section">
    <p className="vm-sidebar-label">WORKSPACE</p>

    <nav className="vm-sidebar-nav">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `vm-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{link.name}</span>
          </NavLink>
        );
      })}
    </nav>
  </div>

  <div className="vm-sidebar-bottom">
    <div className="vm-sidebar-profile">
      <div className="vm-profile-avatar">
        {(user?.name || "U").charAt(0).toUpperCase()}
      </div>

      <div className="vm-profile-info">
        <strong>{user?.name || "User"}</strong>
        <span>{user?.email || "Welcome back"}</span>
      </div>
    </div>

    <button
      type="button"
      className="vm-sidebar-logout"
      onClick={handleLogout}
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  </div>
</aside>

);
}