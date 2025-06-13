"use client";
import { useEffect, useState } from "react";
import Toast from "./Toast";

export default function MatchesManager() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [date, setDate] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("SCHEDULED");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editHomeTeamId, setEditHomeTeamId] = useState("");
  const [editAwayTeamId, setEditAwayTeamId] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState("SCHEDULED");
  const [editHomeScore, setEditHomeScore] = useState("");
  const [editAwayScore, setEditAwayScore] = useState("");
  const [editedMatch, setEditedMatch] = useState<any>(null);
  const [editStats, setEditStats] = useState<any[]>([]);
  const [editTeamStats, setEditTeamStats] = useState<any[]>([]);
  const [playerStatsInput, setPlayerStatsInput] = useState<Record<string, Record<string, number | string>>>({});
  const [teamStatsInput, setTeamStatsInput] = useState<Record<string, Record<string, number | string>>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Define stat types for each sport (based on prisma/schema.prisma)
  const sportPlayerStats: Record<string, string[]> = {
    SOCCER: ['GOALS', 'ASSISTS', 'SHOTS', 'SHOTS_ON_TARGET', 'PASSES', 'PASS_ACCURACY', 'TACKLES', 'FOULS', 'YELLOW_CARDS', 'RED_CARDS'],
    BASKETBALL: ['POINTS', 'REBOUNDS', 'ASSISTS_BASKETBALL', 'STEALS', 'BLOCKS', 'TURNOVERS', 'THREE_POINTERS', 'FREE_THROWS', 'FIELD_GOALS'],
    TENNIS: ['ACES', 'DOUBLE_FAULTS', 'FIRST_SERVES', 'FIRST_SERVE_PERCENTAGE', 'WINNERS', 'UNFORCED_ERRORS', 'BREAK_POINTS_WON', 'BREAK_POINTS_SAVED'],
  };

  const sportTeamStats: Record<string, string[]> = {
    SOCCER: ['POSSESSION', 'CORNERS', 'OFFSIDES', 'CLEAN_SHEETS', 'GOALS_CONCEDED', 'GOALS_SCORED'],
    BASKETBALL: ['TEAM_POINTS', 'TEAM_REBOUNDS', 'TEAM_ASSISTS', 'TEAM_STEALS', 'TEAM_BLOCKS', 'TEAM_TURNOVERS', 'TEAM_FOULS', 'THREE_POINTERS_MADE', 'FREE_THROWS_MADE'],
    TENNIS: ['TEAM_ACES', 'TEAM_DOUBLE_FAULTS', 'TEAM_WINNERS', 'TEAM_UNFORCED_ERRORS', 'TEAM_BREAK_POINTS_WON'],
  };

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      setMatches(data);
    } catch {
      setError("Failed to fetch matches");
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
    fetchMatches();
    fetchTeams();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("add");
    setError("");
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          homeTeamId,
          awayTeamId,
          location,
          homeScore: homeScore ? Number(homeScore) : null,
          awayScore: awayScore ? Number(awayScore) : null,
          status,
        }),
      });
      if (!res.ok) throw new Error();
      setDate("");
      setHomeTeamId("");
      setAwayTeamId("");
      setLocation("");
      setStatus("SCHEDULED");
      setHomeScore("");
      setAwayScore("");
      fetchMatches();
      setToast({ message: "Match added!", type: "success" });
    } catch {
      setError("Failed to add match");
      setToast({ message: "Failed to add match", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setError("");
    try {
      const res = await fetch(`/api/matches?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchMatches();
      setToast({ message: "Match deleted!", type: "success" });
    } catch {
      setError("Failed to delete match");
      setToast({ message: "Failed to delete match", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (match: any) => {
    setEditingId(match.id);
    try {
      const res = await fetch(`/api/matches?id=${match.id}`);
      if (res.ok) {
        const detailedMatch = await res.json();
        setEditedMatch(detailedMatch[0]);
        setEditDate(detailedMatch[0].date ? detailedMatch[0].date.slice(0, 16) : "");
        setEditHomeTeamId(detailedMatch[0].homeTeamId);
        setEditAwayTeamId(detailedMatch[0].awayTeamId);
        setEditLocation(detailedMatch[0].location || "");
        setEditStatus(detailedMatch[0].status);
        setEditHomeScore(detailedMatch[0].homeScore ?? "");
        setEditAwayScore(detailedMatch[0].awayScore ?? "");

        setEditStats(detailedMatch[0].stats || []);
        setEditTeamStats(detailedMatch[0].teamStats || []);

        const initialPlayerStatsInput: Record<string, Record<string, number | string>> = {};
        detailedMatch[0].stats?.forEach((stat: any) => {
          if (!initialPlayerStatsInput[stat.playerId]) {
            initialPlayerStatsInput[stat.playerId] = {};
          }
          initialPlayerStatsInput[stat.playerId][stat.type] = stat.value;
        });
        setPlayerStatsInput(initialPlayerStatsInput);

        const initialTeamStatsInput: Record<string, Record<string, number | string>> = {};
        detailedMatch[0].teamStats?.forEach((teamStat: any) => {
          if (!initialTeamStatsInput[teamStat.teamId]) {
            initialTeamStatsInput[teamStat.teamId] = {};
          }
          initialTeamStatsInput[teamStat.teamId][teamStat.type] = teamStat.value;
        });
        setTeamStatsInput(initialTeamStatsInput);
      } else {
        console.error("Failed to fetch detailed match for editing");
      }
    } catch (error) {
      console.error("Error fetching detailed match for editing:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setActionLoading("update");
    setError("");

    const matchUpdatePayload = {
      id: editingId,
      date: editDate,
      homeTeamId: editHomeTeamId,
      awayTeamId: editAwayTeamId,
      location: editLocation,
      homeScore: editHomeScore ? Number(editHomeScore) : null,
      awayScore: editAwayScore ? Number(editAwayScore) : null,
      status: editStatus,
    };

    try {
      // Handle Player Stats
      const playerStatPromises = Object.keys(playerStatsInput).flatMap(playerId =>
        Object.keys(playerStatsInput[playerId]).map(async statType => {
          const value = playerStatsInput[playerId][statType];
          const existingStat = editStats.find(stat => stat.playerId === playerId && stat.type === statType);

          if (value !== '' && value !== null) {
            if (existingStat) {
              // Update existing stat if value changed
              if (existingStat.value !== value) {
                const res = await fetch("/api/stats", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: existingStat.id, value: Number(value), type: statType }),
                });
                if (!res.ok) console.error(`Failed to update player stat ${statType} for player ${playerId}`);
              }
            } else {
              // Create new stat
              const res = await fetch("/api/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId: editingId, playerId, type: statType, value: Number(value) }),
              });
              if (!res.ok) console.error(`Failed to create player stat ${statType} for player ${playerId}`);
            }
          } else if (existingStat) {
            // Delete stat if value is empty/null and stat exists
             const res = await fetch(`/api/stats?id=${existingStat.id}`, { method: "DELETE" });
             if (!res.ok) console.error(`Failed to delete player stat ${statType} for player ${playerId}`);
          }
        })
      );

      // Handle Team Stats
       const teamStatPromises = Object.keys(teamStatsInput).flatMap(teamId =>
        Object.keys(teamStatsInput[teamId]).map(async statType => {
          const value = teamStatsInput[teamId][statType];
          const existingTeamStat = editTeamStats.find(stat => stat.teamId === teamId && stat.type === statType);

          if (value !== '' && value !== null) {
            if (existingTeamStat) {
              // Update existing team stat if value changed
              if (existingTeamStat.value !== value) {
                const res = await fetch("/api/stats", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: existingTeamStat.id, value: Number(value), type: statType }),
                });
                if (!res.ok) console.error(`Failed to update team stat ${statType} for team ${teamId}`);
              }
            } else {
              // Create new team stat
              const res = await fetch("/api/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId: editingId, teamId, type: statType, value: Number(value) }),
              });
              if (!res.ok) console.error(`Failed to create team stat ${statType} for team ${teamId}`);
            }
          } else if (existingTeamStat) {
             // Delete team stat if value is empty/null and stat exists
             const res = await fetch(`/api/stats?id=${existingTeamStat.id}`, { method: "DELETE" });
             if (!res.ok) console.error(`Failed to delete team stat ${statType} for team ${teamId}`);
          }
        })
      );

      // Wait for all stat updates/creations/deletions to complete
      await Promise.all([...playerStatPromises, ...teamStatPromises]);

      // Update the main match details
      const res = await fetch("/api/matches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchUpdatePayload),
      });

      if (!res.ok) throw new Error();

      setEditingId(null);
      fetchMatches(); // Refresh the matches list
      setToast({ message: "Match updated!", type: "success" });
    } catch (error) {
      setError("Failed to update match or stats");
      setToast({ message: "Failed to update match or stats", type: "error" });
       console.error("Error updating match or stats:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Matches</h3>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleAdd} style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <input
          type="datetime-local"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          style={{ padding: 6 }}
        />
        <select value={homeTeamId} onChange={e => setHomeTeamId(e.target.value)} required style={{ padding: 6 }}>
          <option value="">Home Team</option>
          {teams.map((team: any) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <select value={awayTeamId} onChange={e => setAwayTeamId(e.target.value)} required style={{ padding: 6 }}>
          <option value="">Away Team</option>
          {teams.map((team: any) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ padding: 6, flexGrow: 1 }}
        />
        <input
          type="number"
          placeholder="Home Score"
          value={homeScore}
          onChange={e => setHomeScore(e.target.value)}
          style={{ padding: 6 }}
        />
        <input
          type="number"
          placeholder="Away Score"
          value={awayScore}
          onChange={e => setAwayScore(e.target.value)}
          style={{ padding: 6 }}
        />
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 6 }}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button type="submit" disabled={loading || actionLoading === "add"} style={{ padding: "8px 18px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontWeight: 500, cursor: loading || actionLoading === "add" ? "not-allowed" : "pointer" }}>{actionLoading === "add" ? "Adding..." : "Add Match"}</button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading matches...</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {matches.map((match: any) => (
            <li key={match.id} style={{ marginBottom: 12, border: "1px solid #eee", borderRadius: 6, padding: 10, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
              {editingId === match.id ? (
                <form onSubmit={handleUpdate} style={{ display: "flex", flexWrap: "wrap", gap: 8, flexGrow: 1, marginRight: 12, alignItems: "center" }}>
                  <input
                    type="datetime-local"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    required
                    style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  <select value={editHomeTeamId} onChange={e => setEditHomeTeamId(e.target.value)} required style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}>
                    <option value="">Home Team</option>
                    {teams.map((team: any) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  <select value={editAwayTeamId} onChange={e => setEditAwayTeamId(e.target.value)} required style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}>
                    <option value="">Away Team</option>
                    {teams.map((team: any) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    style={{ padding: 6, flexGrow: 1, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  <input
                    type="number"
                    value={editHomeScore}
                    onChange={e => setEditHomeScore(e.target.value)}
                    style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  <input
                    type="number"
                    value={editAwayScore}
                    onChange={e => setEditAwayScore(e.target.value)}
                    style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  {/* Stats Input Section */}
                  {editedMatch && (
                    <div style={{ width: "100%", marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16 }}>
                      <h4>Stats</h4>

                      {/* Team Stats */}
                      <div style={{ marginBottom: 16 }}>
                        <h5>Team Stats</h5>
                        {/* Home Team Stats */}
                        {editedMatch.homeTeam && (
                          <div style={{ marginBottom: 8 }}>
                            <h6>{editedMatch.homeTeam.name}</h6>
                            {/* Render input fields for home team stats based on sport */}
                            {sportTeamStats[editedMatch.homeTeam.sport]?.map(statType => (
                              <div key={statType}>
                                <span>{statType.replace(/_/g, ' ')}:</span>
                                <input
                                  type="number"
                                  value={teamStatsInput[editedMatch.homeTeamId]?.[statType] ?? ''}
                                  onChange={e => {
                                    const value = e.target.value;
                                    setTeamStatsInput(prevStats => ({
                                      ...prevStats,
                                      [editedMatch.homeTeamId]: {
                                        ...prevStats[editedMatch.homeTeamId],
                                        [statType]: value === '' ? '' : Number(value),
                                      },
                                    }));
                                  }}
                                  style={{ marginLeft: 8, width: 60, padding: 4 }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Away Team Stats */}
                        {editedMatch.awayTeam && (
                          <div>
                            <h6>{editedMatch.awayTeam.name}</h6>
                            {/* Render input fields for away team stats based on sport */}
                            {sportTeamStats[editedMatch.awayTeam.sport]?.map(statType => (
                              <div key={statType}>
                                <span>{statType.replace(/_/g, ' ')}:</span>
                                <input
                                  type="number"
                                  value={teamStatsInput[editedMatch.awayTeamId]?.[statType] ?? ''}
                                  onChange={e => {
                                    const value = e.target.value;
                                    setTeamStatsInput(prevStats => ({
                                      ...prevStats,
                                      [editedMatch.awayTeamId]: {
                                        ...prevStats[editedMatch.awayTeamId],
                                        [statType]: value === '' ? '' : Number(value),
                                      },
                                    }));
                                  }}
                                  style={{ marginLeft: 8, width: 60, padding: 4 }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Player Stats */}
                      <div>
                        <h5>Player Stats</h5>
                        {/* Home Team Players */}
                        {editedMatch.homeTeam?.players && editedMatch.homeTeam.players.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <h6>{editedMatch.homeTeam.name} Players</h6>
                            {editedMatch.homeTeam.players.map((player: any) => (
                              <div key={player.id} style={{ marginBottom: 8, borderBottom: "1px dashed #eee", paddingBottom: 8 }}>
                                <span>{player.name} (#{player.number}):</span>
                                <div style={{ marginLeft: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                                  {/* Render input fields for player stats based on sport */}
                                  {sportPlayerStats[editedMatch.homeTeam.sport]?.map(statType => (
                                    <div key={statType}>
                                      <span>{statType.replace(/_/g, ' ')}:</span>
                                      <input
                                        type="number"
                                        value={playerStatsInput[player.id]?.[statType] ?? ''}
                                        onChange={e => {
                                          const value = e.target.value;
                                          setPlayerStatsInput(prevStats => ({
                                            ...prevStats,
                                            [player.id]: {
                                              ...prevStats[player.id],
                                              [statType]: value === '' ? '' : Number(value),
                                            },
                                          }));
                                        }}
                                        style={{ marginLeft: 8, width: 60, padding: 4 }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Away Team Players */}
                         {editedMatch.awayTeam?.players && editedMatch.awayTeam.players.length > 0 && (
                          <div>
                            <h6>{editedMatch.awayTeam.name} Players</h6>
                            {editedMatch.awayTeam.players.map((player: any) => (
                              <div key={player.id} style={{ marginBottom: 8, borderBottom: "1px dashed #eee", paddingBottom: 8 }}>
                                <span>{player.name} (#{player.number}):</span>
                                <div style={{ marginLeft: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                                  {/* Render input fields for player stats based on sport */}
                                  {sportPlayerStats[editedMatch.awayTeam.sport]?.map(statType => (
                                    <div key={statType}>
                                      <span>{statType.replace(/_/g, ' ')}:</span>
                                      <input
                                        type="number"
                                        value={playerStatsInput[player.id]?.[statType] ?? ''}
                                        onChange={e => {
                                          const value = e.target.value;
                                          setPlayerStatsInput(prevStats => ({
                                            ...prevStats,
                                            [player.id]: {
                                              ...prevStats[player.id],
                                              [statType]: value === '' ? '' : Number(value),
                                            },
                                          }));
                                        }}
                                        style={{ marginLeft: 8, width: 60, padding: 4 }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={actionLoading === "update"} style={{ padding: "6px 14px", borderRadius: 4, background: "#059669", color: "#fff", border: "none", fontWeight: 500, cursor: actionLoading === "update" ? "not-allowed" : "pointer" }}>{actionLoading === "update" ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setEditingId(null)} style={{ padding: "6px 14px", borderRadius: 4, background: "#e5e7eb", color: "#374151", border: "none", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                </form>
              ) : (
                <div style={{ flexGrow: 1, marginRight: 12 }}>
                  <b>{match.homeTeam?.name || "?"}</b> vs <b>{match.awayTeam?.name || "?"}</b> <br />
                  {match.date && <span>{new Date(match.date).toLocaleString()}</span>} | {match.location} <br />
                  <b>{match.homeScore ?? "-"}</b> : <b>{match.awayScore ?? "-"}</b> | {match.status}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                 {editingId !== match.id && (
                  <>
                    <button onClick={() => handleEdit(match)} style={{ padding: "6px 14px", borderRadius: 4, background: "#fbbf24", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(match.id)} disabled={actionLoading === match.id} style={{ padding: "6px 14px", borderRadius: 4, background: "#ef4444", color: "#fff", border: "none", fontWeight: 500, cursor: actionLoading === match.id ? "not-allowed" : "pointer" }}>{actionLoading === match.id ? "Deleting..." : "Delete"}</button>
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