"use client";
import { useState } from "react";
import TeamsManager from "./TeamsManager";
import PlayersManager from "./PlayersManager";
import MatchesManager from "./MatchesManager";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("teams"); 

  return (
    <div style={{ width: "100%" }}>
      {/* Tab Buttons */}
      <div style={{ marginBottom: 32, borderBottom: "1px solid #eee", display: "flex", gap: 24, paddingBottom: 8 }}>
        <button
          style={{
            padding: "10px 0", 
            cursor: "pointer",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "teams" ? "2px solid #2563eb" : "none",
            color: activeTab === "teams" ? "#2563eb" : "#555",
            fontWeight: activeTab === "teams" ? "bold" : "normal",
            textAlign: "center",
            flexGrow: 1, 
            minWidth: 100,
          }}
          onClick={() => setActiveTab("teams")}
        >
          Teams
        </button>
        <button
           style={{
            padding: "10px 0",
            cursor: "pointer",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "players" ? "2px solid #2563eb" : "none",
            color: activeTab === "players" ? "#2563eb" : "#555",
            fontWeight: activeTab === "players" ? "bold" : "normal",
            textAlign: "center",
            flexGrow: 1,
            minWidth: 100,
          }}
          onClick={() => setActiveTab("players")}
        >
          Players
        </button>
        <button
           style={{
            padding: "10px 0",
            cursor: "pointer",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "matches" ? "2px solid #2563eb" : "none",
            color: activeTab === "matches" ? "#2563eb" : "#555", // Ensure a neutral color when not active
            fontWeight: activeTab === "matches" ? "bold" : "normal",
            textAlign: "center",
            flexGrow: 1,
            minWidth: 100,
          }}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "teams" && <TeamsManager />}
        {activeTab === "players" && <PlayersManager />}
        {activeTab === "matches" && <MatchesManager />}
      </div>

      {/* Logout button moved to Navbar */}
      {/* <div style={{marginTop: 40}}><LogoutButton /></div> */}

    </div>
  );
} 