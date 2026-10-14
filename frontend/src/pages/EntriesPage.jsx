import React from "react";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search, Shirt, Users } from "lucide-react";
import { getEntries } from "../lib/api.js";

export default function EntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEntries(await getEntries());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const filteredEntries = entries.filter((entry) =>
    `${entry.jerseyName} ${entry.jerseyNumber} ${entry.jerseySize} ${entry.pantWaist} ${entry.pantLength}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="page-heading entries-heading">
        <div>
          <div className="eyebrow">REGISTRATION OVERVIEW</div>
          <h1>Saved <span>entries.</span></h1>
          <p className="page-description">Every submitted kit detail, together in one place.</p>
        </div>
        <div className="heading-art" aria-hidden="true">
          <div className="art-circle"><Users size={55} strokeWidth={1.15} /></div>
        </div>
      </section>

      <section className="entries-card">
        <div className="entries-toolbar">
          <div className="entries-count">
            <div className="section-icon jersey-icon"><Shirt size={20} /></div>
            <div><h2>All registrations</h2><p>{entries.length} {entries.length === 1 ? "entry" : "entries"} saved</p></div>
          </div>
          <div className="toolbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search entries..." aria-label="Search entries" />
            </label>
            <button className="icon-button" onClick={loadEntries} type="button" title="Refresh entries" aria-label="Refresh entries" disabled={loading}>
              <RefreshCw size={17} className={loading ? "spin" : ""} />
            </button>
          </div>
        </div>

        {error && <div className="notice error table-notice">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PLAYER</th>
                <th>JERSEY NO.</th>
                <th>SIZE</th>
                <th>SLEEVE</th>
                <th>PANT WAIST</th>
                <th>PANT LENGTH</th>
                <th>DATE ADDED</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="table-state"><span className="loader" />Loading registrations...</td></tr>
              ) : filteredEntries.length === 0 ? (
                <tr><td colSpan="7" className="table-state">
                  <div className="empty-state"><div className="empty-icon"><Search size={23} /></div><strong>{search ? "No matching entries" : "No entries yet"}</strong><span>{search ? "Try another name or jersey detail." : "Submitted registrations will appear here."}</span></div>
                </td></tr>
              ) : filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td><div className="player-cell"><span className="player-avatar">{entry.jerseyName.trim().charAt(0).toUpperCase()}</span><strong>{entry.jerseyName}</strong></div></td>
                  <td><span className="number-pill">{String(entry.jerseyNumber).padStart(2, "0")}</span></td>
                  <td><span className="size-pill">{entry.jerseySize}</span></td>
                  <td><span className="sleeve-pill">{entry.sleeve === "HALF" ? "Half" : "Full"}</span></td>
                  <td>{entry.pantWaist}</td>
                  <td>{entry.pantLength}</td>
                  <td className="date-cell">{new Date(entry.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span>Showing {loading ? "—" : filteredEntries.length} of {entries.length} entries</span><span><span className="status-dot" /> Synced with database</span></div>
      </section>
    </>
  );
}
