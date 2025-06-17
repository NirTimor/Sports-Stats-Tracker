'use client';

import { useState, useEffect } from 'react';
import Toast from '../../dashboard/Toast';

interface MatchTimelineProps {
    matchId: string;
    player1Name: string;
    player2Name: string;
}

interface TimelineEvent {
    id: string;
    type: 'point' | 'game' | 'set';
    player: 'player1' | 'player2';
    description: string;
    timestamp: string;
}

export default function MatchTimeline({ matchId, player1Name, player2Name }: MatchTimelineProps) {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [newEvent, setNewEvent] = useState({
        type: 'point',
        player: 'player1',
        description: ''
    });

    useEffect(() => {
        if (matchId) {
            fetchTimeline();
        }
    }, [matchId]);

    const fetchTimeline = async () => {
        try {
            const res = await fetch(`/api/timeline/tennis?matchId=${matchId}`);
            const data = await res.json();
            setEvents(data);
        } catch {
            setToast({ message: 'Failed to fetch timeline', type: 'error' });
        }
    };

    const handleAddEvent = async () => {
        if (!newEvent.description.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/timeline/tennis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    ...newEvent
                })
            });

            if (!res.ok) throw new Error();

            setNewEvent({ ...newEvent, description: '' });
            fetchTimeline();
            setToast({ message: 'Event added successfully!', type: 'success' });
        } catch {
            setToast({ message: 'Failed to add event', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'point':
                return '🎯';
            case 'game':
                return '🎮';
            case 'set':
                return '🏆';
            default:
                return '•';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Match Timeline</h3>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Add Event Form */}
            <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600">Event Type</label>
                        <select
                            value={newEvent.type}
                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="point">Point</option>
                            <option value="game">Game</option>
                            <option value="set">Set</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Player</label>
                        <select
                            value={newEvent.player}
                            onChange={(e) => setNewEvent({ ...newEvent, player: e.target.value as any })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="player1">{player1Name}</option>
                            <option value="player2">{player2Name}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Description</label>
                    <input
                        type="text"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Enter event description..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <button
                    onClick={handleAddEvent}
                    disabled={loading || !newEvent.description.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Event'}
                </button>
            </div>

            {/* Timeline Events */}
            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg ${event.player === 'player1' ? 'bg-blue-50' : 'bg-red-50'
                            }`}
                    >
                        <span className="text-xl">{getEventIcon(event.type)}</span>
                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                {event.player === 'player1' ? player1Name : player2Name}
                            </p>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 