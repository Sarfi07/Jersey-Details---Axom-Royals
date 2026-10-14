import React from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { ClipboardList, Shirt, Users } from "lucide-react";
import EntryForm from "./pages/EntryForm.jsx";
import EntriesPage from "./pages/EntriesPage.jsx";

export default function App() {
  const location = useLocation();
  const isEntries = location.pathname === "/entries";

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
  <img
    src="/logo2.png"
    alt="Axom Royals"
    className="brand-logo"
  />
  <span>Axom <span className="brand-light">Royals</span></span>
</NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <ClipboardList size={17} /> Registration
          </NavLink>
          <NavLink to="/entries" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Users size={17} /> All entries
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <div className="page-kicker"><span className="status-dot" /> TEAM KIT REGISTRATION</div>
        <Routes>
          <Route path="/" element={<EntryForm />} />
          <Route path="/entries" element={<EntriesPage />} />
          <Route path="*" element={<EntryForm />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>Developed by @SA20 <span className="footer-separator">/</span> Team apparel management</span>
        <span>Keep it simple. Get the right fit.</span>
      </footer>
    </div>
  );
}
