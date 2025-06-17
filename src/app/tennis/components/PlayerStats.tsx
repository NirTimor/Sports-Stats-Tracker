'use client';

import { useState, useEffect } from 'react';
import Toast from '../../dashboard/Toast';

interface PlayerStatsProps {
    player: any;
    matchId: string;
}

export default function PlayerStats({ player, matchId }: PlayerStatsProps) {
    const [stats, setStats] = useState({
        aces: 0,
        doubleFaults: 0,
        firstServePercentage: 0,
        winners: 0,
        unforcedErrors: 0,
        breakPointsWon: 0,
        breakPointsFaced: 0
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (player && matchId) {
            fetchPlayerStats();
        }
    }, [player, matchId]);

    const fetchPlayerStats = async () => {
        try {
            const res = await fetch(`/api/stats/tennis/player?matchId=${matchId}&playerId=${player.id}`);
            const data = await res.json();
            if (data) {
                setStats(data);
            }
        } catch {
            setToast({ message: 'Failed to fetch player stats', type: 'error' });
        }
    };

    const handleStatChange = (stat: string, value: number) => {
        setStats(prev => ({
            ...prev,
            [stat]: value
        }));
    };

    const handleSaveStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stats/tennis/player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    playerId: player.id,
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

    if (!player) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{player.name}</h3>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-600">Aces</label>
                    <input
                        type="number"
                        value={stats.aces}
                        onChange={(e) => handleStatChange('aces', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Double Faults</label>
                    <input
                        type="number"
                        value={stats.doubleFaults}
                        onChange={(e) => handleStatChange('doubleFaults', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">First Serve %</label>
                    <input
                        type="number"
                        value={stats.firstServePercentage}
                        onChange={(e) => handleStatChange('firstServePercentage', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Winners</label>
                    <input
                        type="number"
                        value={stats.winners}
                        onChange={(e) => handleStatChange('winners', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Unforced Errors</label>
                    <input
                        type="number"
                        value={stats.unforcedErrors}
                        onChange={(e) => handleStatChange('unforcedErrors', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Break Points Won</label>
                    <input
                        type="number"
                        value={stats.breakPointsWon}
                        onChange={(e) => handleStatChange('breakPointsWon', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Break Points Faced</label>
                    <input
                        type="number"
                        value={stats.breakPointsFaced}
                        onChange={(e) => handleStatChange('breakPointsFaced', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
            </div>

            <button
                onClick={handleSaveStats}
                disabled={loading}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save Player Stats'}
            </button>
        </div>
    );
} 