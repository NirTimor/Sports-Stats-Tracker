'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Toast from '../dashboard/Toast';
import PlayerStats from './components/PlayerStats';
import MatchTimeline from './components/MatchTimeline';

export default function TennisPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [player1, setPlayer1] = useState<any>(null);
    const [player2, setPlayer2] = useState<any>(null);
    const [stats, setStats] = useState({
        player1: {
            sets: 0,
            games: 0,
            aces: 0,
            doubleFaults: 0,
            firstServePercentage: 0
        },
        player2: {
            sets: 0,
            games: 0,
            aces: 0,
            doubleFaults: 0,
            firstServePercentage: 0
        }
    });

    useEffect(() => {
        if (status === 'authenticated') {
            fetchMatches();
        }
    }, [status]);

    useEffect(() => {
        if (selectedMatch) {
            fetchPlayers();
            fetchMatchStats();
        }
    }, [selectedMatch]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/matches?sport=TENNIS');
            const data = await res.json();
            setMatches(data);
        } catch {
            setToast({ message: 'Failed to fetch matches', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        if (!selectedMatch) return;

        try {
            const [player1Res, player2Res] = await Promise.all([
                fetch(`/api/players/${selectedMatch.player1Id}`),
                fetch(`/api/players/${selectedMatch.player2Id}`)
            ]);

            const [player1Data, player2Data] = await Promise.all([
                player1Res.json(),
                player2Res.json()
            ]);

            setPlayer1(player1Data);
            setPlayer2(player2Data);
        } catch {
            setToast({ message: 'Failed to fetch players', type: 'error' });
        }
    };

    const fetchMatchStats = async () => {
        if (!selectedMatch) return;

        try {
            const res = await fetch(`/api/stats/tennis?matchId=${selectedMatch.id}`);
            const data = await res.json();
            if (data) {
                setStats({
                    player1: {
                        sets: data.player1Sets,
                        games: data.player1Games,
                        aces: data.player1Aces,
                        doubleFaults: data.player1DoubleFaults,
                        firstServePercentage: data.player1FirstServePercentage
                    },
                    player2: {
                        sets: data.player2Sets,
                        games: data.player2Games,
                        aces: data.player2Aces,
                        doubleFaults: data.player2DoubleFaults,
                        firstServePercentage: data.player2FirstServePercentage
                    }
                });
            }
        } catch {
            setToast({ message: 'Failed to fetch match stats', type: 'error' });
        }
    };

    const handleStatChange = (player: 'player1' | 'player2', stat: string, value: number) => {
        setStats(prev => ({
            ...prev,
            [player]: {
                ...prev[player],
                [stat]: value
            }
        }));
    };

    const handleSaveStats = async () => {
        if (!selectedMatch) return;

        setLoading(true);
        try {
            const res = await fetch('/api/stats/tennis', {
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
            <h1 className="text-3xl font-bold mb-8">Tennis Match Management</h1>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Match Selection */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Select Match</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.map((match: any) => (
                            <div
                                key={match.id}
                                className={`p-4 border rounded cursor-pointer ${selectedMatch?.id === match.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                onClick={() => setSelectedMatch(match)}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{match.player1.name}</span>
                                    <span className="font-bold">vs</span>
                                    <span>{match.player2.name}</span>
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
                        {/* Match Stats */}
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Match Stats</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Player 1 Stats */}
                                <div>
                                    <h3 className="font-medium mb-4">{player1?.name}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600">Sets</label>
                                            <input
                                                type="number"
                                                value={stats.player1.sets}
                                                onChange={(e) => handleStatChange('player1', 'sets', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Games</label>
                                            <input
                                                type="number"
                                                value={stats.player1.games}
                                                onChange={(e) => handleStatChange('player1', 'games', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Aces</label>
                                            <input
                                                type="number"
                                                value={stats.player1.aces}
                                                onChange={(e) => handleStatChange('player1', 'aces', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Double Faults</label>
                                            <input
                                                type="number"
                                                value={stats.player1.doubleFaults}
                                                onChange={(e) => handleStatChange('player1', 'doubleFaults', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">First Serve %</label>
                                            <input
                                                type="number"
                                                value={stats.player1.firstServePercentage}
                                                onChange={(e) => handleStatChange('player1', 'firstServePercentage', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Player 2 Stats */}
                                <div>
                                    <h3 className="font-medium mb-4">{player2?.name}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600">Sets</label>
                                            <input
                                                type="number"
                                                value={stats.player2.sets}
                                                onChange={(e) => handleStatChange('player2', 'sets', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Games</label>
                                            <input
                                                type="number"
                                                value={stats.player2.games}
                                                onChange={(e) => handleStatChange('player2', 'games', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Aces</label>
                                            <input
                                                type="number"
                                                value={stats.player2.aces}
                                                onChange={(e) => handleStatChange('player2', 'aces', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Double Faults</label>
                                            <input
                                                type="number"
                                                value={stats.player2.doubleFaults}
                                                onChange={(e) => handleStatChange('player2', 'doubleFaults', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">First Serve %</label>
                                            <input
                                                type="number"
                                                value={stats.player2.firstServePercentage}
                                                onChange={(e) => handleStatChange('player2', 'firstServePercentage', parseInt(e.target.value))}
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
                                    {loading ? 'Saving...' : 'Save Match Stats'}
                                </button>
                            </div>
                        </div>

                        {/* Match Timeline */}
                        <div className="lg:col-span-3">
                            <MatchTimeline
                                matchId={selectedMatch.id}
                                player1Name={player1?.name}
                                player2Name={player2?.name}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 