'use client';

import { useState } from 'react';
import Toast from '../../dashboard/Toast';

interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string | null;
}

interface PlayerStatsProps {
  players: Player[];
  matchId: string;
  teamType: 'home' | 'away';
}

export default function PlayerStats({ players, matchId, teamType }: PlayerStatsProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [stats, setStats] = useState({
    goals: 0,
    assists: 0,
    shots: 0,
    shotsOnTarget: 0,
    passes: 0,
    passAccuracy: 0,
    tackles: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleStatChange = (stat: string, value: number) => {
    setStats(prev => ({
      ...prev,
      [stat]: value
    }));
  };

  const handleSaveStats = async () => {
    if (!selectedPlayer) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          playerId: selectedPlayer,
          stats: Object.entries(stats).map(([type, value]) => ({
            type: type.toUpperCase(),
            value
          }))
        })
      });
      
      if (!res.ok) throw new Error();
      
      setToast({ message: 'Player stats saved successfully!', type: 'success' });
      setStats({
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        passes: 0,
        passAccuracy: 0,
        tackles: 0,
        fouls: 0,
        yellowCards: 0,
        redCards: 0
      });
    } catch {
      setToast({ message: 'Failed to save player stats', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">{teamType === 'home' ? 'Home' : 'Away'} Team Player Stats</h3>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Player</label>
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Choose a player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.number ? `#${player.number} - ` : ''}{player.name} {player.position ? `(${player.position})` : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedPlayer && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Goals</label>
            <input
              type="number"
              value={stats.goals}
              onChange={(e) => handleStatChange('goals', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Assists</label>
            <input
              type="number"
              value={stats.assists}
              onChange={(e) => handleStatChange('assists', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Shots</label>
            <input
              type="number"
              value={stats.shots}
              onChange={(e) => handleStatChange('shots', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Shots on Target</label>
            <input
              type="number"
              value={stats.shotsOnTarget}
              onChange={(e) => handleStatChange('shotsOnTarget', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Passes</label>
            <input
              type="number"
              value={stats.passes}
              onChange={(e) => handleStatChange('passes', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Pass Accuracy (%)</label>
            <input
              type="number"
              value={stats.passAccuracy}
              onChange={(e) => handleStatChange('passAccuracy', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Tackles</label>
            <input
              type="number"
              value={stats.tackles}
              onChange={(e) => handleStatChange('tackles', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Fouls</label>
            <input
              type="number"
              value={stats.fouls}
              onChange={(e) => handleStatChange('fouls', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Yellow Cards</label>
            <input
              type="number"
              value={stats.yellowCards}
              onChange={(e) => handleStatChange('yellowCards', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Red Cards</label>
            <input
              type="number"
              value={stats.redCards}
              onChange={(e) => handleStatChange('redCards', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      )}

      {selectedPlayer && (
        <button
          onClick={handleSaveStats}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Player Stats'}
        </button>
      )}
    </div>
  );
} 