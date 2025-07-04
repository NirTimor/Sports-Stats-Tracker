'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Toast from '../dashboard/Toast';
import PlayerStats from './components/PlayerStats';
import MatchTimeline from './components/MatchTimeline';

export default function BasketballPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);
  const [stats, setStats] = useState({
    homeTeam: { points: 0, rebounds: 0, assists: 0 },
    awayTeam: { points: 0, rebounds: 0, assists: 0 }
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMatches();
    }
  }, [status]);

  useEffect(() => {
    if (selectedMatch) {
      fetchTeamPlayers();
      fetchMatchStats();
    }
  }, [selectedMatch]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches?sport=BASKETBALL');
      const data = await res.json();
      setMatches(data);
    } catch {
      setToast({ message: 'Failed to fetch matches', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamPlayers = async () => {
    if (!selectedMatch) return;

    try {
      const [homeRes, awayRes] = await Promise.all([
        fetch(`/api/teams/${selectedMatch.homeTeamId}/players`),
        fetch(`/api/teams/${selectedMatch.awayTeamId}/players`)
      ]);

      const [homePlayers, awayPlayers] = await Promise.all([
        homeRes.json(),
        awayRes.json()
      ]);

      setHomeTeamPlayers(homePlayers);
      setAwayTeamPlayers(awayPlayers);
    } catch {
      setToast({ message: 'Failed to fetch team players', type: 'error' });
    }
  };

  const fetchMatchStats = async () => {
    if (!selectedMatch) return;

    try {
      const res = await fetch(`/api/stats/basketball?matchId=${selectedMatch.id}`);
      const data = await res.json();
      if (data) {
        setStats({
          homeTeam: {
            points: data.homePoints,
            rebounds: data.homeRebounds,
            assists: data.homeAssists
          },
          awayTeam: {
            points: data.awayPoints,
            rebounds: data.awayRebounds,
            assists: data.awayAssists
          }
        });
      }
    } catch {
      setToast({ message: 'Failed to fetch match stats', type: 'error' });
    }
  };

  const handleStatChange = (team: 'homeTeam' | 'awayTeam', stat: string, value: number) => {
    setStats(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        [stat]: value
      }
    }));
  };

  const handleSaveStats = async () => {
    if (!selectedMatch) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/stats/basketball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          stats
        })
      });
      
      if (!res.ok) throw new Error();
      
      setToast({ message: 'Stats saved successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save stats', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Basketball Match Management</h1>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Selection */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Select Match</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match: any) => (
              <div
                key={match.id}
                className={`p-4 border rounded cursor-pointer ${
                  selectedMatch?.id === match.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex justify-between items-center">
                  <span>{match.homeTeam.name}</span>
                  <span className="font-bold">vs</span>
                  <span>{match.awayTeam.name}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(match.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMatch && (
          <>
            {/* Team Stats */}
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Match Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Home Team Stats */}
                <div>
                  <h3 className="font-medium mb-4">{selectedMatch.homeTeam.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Points</label>
                      <input
                        type="number"
                        value={stats.homeTeam.points}
                        onChange={(e) => handleStatChange('homeTeam', 'points', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Rebounds</label>
                      <input
                        type="number"
                        value={stats.homeTeam.rebounds}
                        onChange={(e) => handleStatChange('homeTeam', 'rebounds', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Assists</label>
                      <input
                        type="number"
                        value={stats.homeTeam.assists}
                        onChange={(e) => handleStatChange('homeTeam', 'assists', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Away Team Stats */}
                <div>
                  <h3 className="font-medium mb-4">{selectedMatch.awayTeam.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Points</label>
                      <input
                        type="number"
                        value={stats.awayTeam.points}
                        onChange={(e) => handleStatChange('awayTeam', 'points', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Rebounds</label>
                      <input
                        type="number"
                        value={stats.awayTeam.rebounds}
                        onChange={(e) => handleStatChange('awayTeam', 'rebounds', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Assists</label>
                      <input
                        type="number"
                        value={stats.awayTeam.assists}
                        onChange={(e) => handleStatChange('awayTeam', 'assists', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveStats}
                  disabled={loading}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Team Stats'}
                </button>
              </div>
            </div>

            {/* Player Stats */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <PlayerStats
                  players={homeTeamPlayers}
                  matchId={selectedMatch.id}
                  teamType="home"
                />
                <PlayerStats
                  players={awayTeamPlayers}
                  matchId={selectedMatch.id}
                  teamType="away"
                />
              </div>
            </div>

            {/* Match Timeline */}
            <div className="lg:col-span-1">
              <MatchTimeline
                matchId={selectedMatch.id}
                homeTeamName={selectedMatch.homeTeam.name}
                awayTeamName={selectedMatch.awayTeam.name}
                players={[...homeTeamPlayers, ...awayTeamPlayers]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 