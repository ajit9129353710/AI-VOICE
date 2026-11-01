import {
BrowserRouter,
Navigate,
Route,
Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Assistant from "./pages/Assistant";

import "./index.css";

function HomeRedirect() {
const { user } = useAuth();

return (
<Navigate
to={user ? "/dashboard" : "/login"}
replace
/>
);
}

function PublicRoute({ children }) {
const { user } = useAuth();

return user ? (
<Navigate to="/dashboard" replace />
) : (
children
);
}

function AppRoutes() {
return (
<Routes>
<Route path="/" element={<HomeRedirect />} />

  <Route
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

  <Route
    path="/signup"
    element={
      <PublicRoute>
        <Signup />
      </PublicRoute>
    }
  />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/tasks"
    element={
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    }
  />


  <Route
    path="/notes"
    element={
      <ProtectedRoute>
        <Notes />
      </ProtectedRoute>
    }
  />

  <Route
    path="/assistant"
    element={
      <ProtectedRoute>
        <Assistant />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<HomeRedirect />} />
</Routes>

);
}

export default function App() {
return (
<BrowserRouter>
<AuthProvider>
<AppRoutes />
</AuthProvider>
</BrowserRouter>
);
}