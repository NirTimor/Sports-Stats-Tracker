"use client";
import { useEffect, useState } from "react";
import Toast from "./Toast";

export default function PlayersManager() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editTeamId, setEditTeamId] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchPlayers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/players");
      const data = await res.json();
      setPlayers(data);
    } catch {
      setError("Failed to fetch players");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch {}
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("add");
    setError("");
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number: Number(number), position, teamId, userId: "demo-user" }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setNumber("");
      setPosition("");
      setTeamId("");
      fetchPlayers();
      setToast({ message: "Player added!", type: "success" });
    } catch {
      setError("Failed to add player");
      setToast({ message: "Failed to add player", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setError("");
    try {
      const res = await fetch(`/api/players?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchPlayers();
      setToast({ message: "Player deleted!", type: "success" });
    } catch {
      setError("Failed to delete player");
      setToast({ message: "Failed to delete player", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (player: any) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditNumber(player.number || "");
    setEditPosition(player.position || "");
    setEditTeamId(player.teamId || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setActionLoading("update");
    setError("");
    try {
      const res = await fetch("/api/players", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name: editName, number: Number(editNumber), position: editPosition, teamId: editTeamId }),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      fetchPlayers();
      setToast({ message: "Player updated!", type: "success" });
    } catch {
      setError("Failed to update player");
      setToast({ message: "Failed to update player", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Players</h3>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleAdd} style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Player name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: 180, padding: '6px', textAlign: "center" }}
        />
        <input
          type="number"
          placeholder="Number"
          value={number}
          onChange={e => setNumber(e.target.value)}
          style={{ width: 100, padding: '6px 12px', textAlign: "center" }}
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={e => setPosition(e.target.value)}
          style={{ width: 120, padding: '6px', textAlign: "center" }}
        />
        <select value={teamId} onChange={e => setTeamId(e.target.value)} style={{ width: 150, padding: '6px', textAlign: "center" }}>
          <option value="">Select team</option>
          {teams.map((team: any) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <button type="submit" disabled={loading || actionLoading === "add"} style={{ padding: "8px 18px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontWeight: 500, cursor: loading || actionLoading === "add" ? "not-allowed" : "pointer" }}>{actionLoading === "add" ? "Adding..." : "Add Player"}</button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading players...</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {players.map((player: any) => (
            <li key={player.id} style={{ marginBottom: 12, border: "1px solid #eee", borderRadius: 6, padding: 10, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {editingId === player.id ? (
                <form onSubmit={handleUpdate} style={{ display: "flex", gap: 8, flexGrow: 1, marginRight: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required
                    style={{ width: 180, padding: '6px', borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}
                  />
                  <input
                    type="number"
                    value={editNumber}
                    onChange={e => setEditNumber(e.target.value)}
                    style={{ width: 100, padding: '6px 12px', borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}
                  />
                  <input
                    type="text"
                    value={editPosition}
                    onChange={e => setEditPosition(e.target.value)}
                    style={{ width: 120, padding: '6px', borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}
                  />
                  <select value={editTeamId} onChange={e => setEditTeamId(e.target.value)} style={{ width: 150, padding: '6px', borderRadius: 4, border: "1px solid #ccc", textAlign: "center" }}>
                    <option value="">Select team</option>
                    {teams.map((team: any) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  <button type="submit" disabled={actionLoading === "update"} style={{ padding: "6px 14px", borderRadius: 4, background: "#059669", color: "#fff", border: "none", fontWeight: 500, cursor: actionLoading === "update" ? "not-allowed" : "pointer" }}>{actionLoading === "update" ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setEditingId(null)} style={{ padding: "6px 14px", borderRadius: 4, background: "#e5e7eb", color: "#374151", border: "none", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                </form>
              ) : (
                <div style={{ flexGrow: 1, marginRight: 12 }}>
                  <b>{player.name}</b> #{player.number} ({player.position})
                  {player.team && <span> - {player.team.name}</span>}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                {editingId !== player.id && (
                  <>
                    <button onClick={() => handleEdit(player)} style={{ padding: "6px 14px", borderRadius: 4, background: "#fbbf24", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(player.id)} disabled={actionLoading === player.id} style={{ padding: "6px 14px", borderRadius: 4, background: "#ef4444", color: "#fff", border: "none", fontWeight: 500, cursor: actionLoading === player.id ? "not-allowed" : "pointer" }}>{actionLoading === player.id ? "Deleting..." : "Delete"}</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 