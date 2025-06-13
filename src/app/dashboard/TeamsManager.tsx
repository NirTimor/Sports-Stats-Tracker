"use client";
import { useEffect, useState } from "react";
import Toast from "./Toast";

export default function TeamsManager() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("SOCCER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSport, setEditSport] = useState("SOCCER");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch {
      setError("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sport, userId: "demo-user" }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setSport("SOCCER");
      fetchTeams();
      setToast({ message: "Team added!", type: "success" });
    } catch {
      setError("Failed to add team");
      setToast({ message: "Failed to add team", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchTeams();
      setToast({ message: "Team deleted!", type: "success" });
    } catch {
      setError("Failed to delete team");
      setToast({ message: "Failed to delete team", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setEditName(team.name);
    setEditSport(team.sport);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name: editName, sport: editSport }),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      fetchTeams();
      setToast({ message: "Team updated!", type: "success" });
    } catch {
      setError("Failed to update team");
      setToast({ message: "Failed to update team", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 40, marginBottom: 40, background: "#f8fafc", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: 24 }}>
      <h3 style={{ marginBottom: 16, color: "#1a202c" }}>Teams</h3>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleAdd} style={{ marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Team name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: 1 }}
        />
        <select value={sport} onChange={e => setSport(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}>
          <option value="SOCCER">Soccer</option>
          <option value="BASKETBALL">Basketball</option>
          <option value="TENNIS">Tennis</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: "8px 18px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Add Team</button>
      </form>
      {error && <div style={{ color: "#e53e3e", marginBottom: 12 }}>{error}</div>}
      {loading && <div>Loading...</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={{ textAlign: "left", padding: 10, fontWeight: 600, color: "#374151" }}>Name</th>
            <th style={{ textAlign: "left", padding: 10, fontWeight: 600, color: "#374151" }}>Sport</th>
            <th style={{ padding: 10 }}></th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team: any) => (
            <tr key={team.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              {editingId === team.id ? (
                <>
                  <td style={{ padding: 8 }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      required
                      style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <select value={editSport} onChange={e => setEditSport(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}>
                      <option value="SOCCER">Soccer</option>
                      <option value="BASKETBALL">Basketball</option>
                      <option value="TENNIS">Tennis</option>
                    </select>
                  </td>
                  <td style={{ padding: 8 }}>
                    <button type="submit" form="edit-team-form" style={{ marginRight: 8, padding: "6px 14px", borderRadius: 6, background: "#059669", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Save</button>
                    <button type="button" onClick={() => setEditingId(null)} style={{ padding: "6px 14px", borderRadius: 6, background: "#e5e7eb", color: "#374151", border: "none", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: 8 }}>{team.name}</td>
                  <td style={{ padding: 8 }}>{team.sport}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleEdit(team)} style={{ marginRight: 8, padding: "6px 14px", borderRadius: 6, background: "#fbbf24", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(team.id)} style={{ padding: "6px 14px", borderRadius: 6, background: "#ef4444", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 