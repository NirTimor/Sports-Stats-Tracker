'use client';

import { useState } from 'react';
import Toast from '../../dashboard/Toast';

interface Event {
  id: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'INJURY';
  minute: number;
  team: 'HOME' | 'AWAY';
  playerId: string;
  playerName: string;
  description?: string;
}

interface MatchTimelineProps {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
  players: {
    id: string;
    name: string;
    teamId: string;
  }[];
}

export default function MatchTimeline({ matchId, homeTeamName, awayTeamName, players }: MatchTimelineProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'GOAL',
    minute: 0,
    team: 'HOME',
    playerId: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleAddEvent = async () => {
    if (!newEvent.playerId || !newEvent.minute) return;

    setLoading(true);
    try {
      const res = await fetch('/api/matches/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          ...newEvent
        })
      });

      if (!res.ok) throw new Error();

      const event = await res.json();
      setEvents(prev => [...prev, event]);
      setNewEvent({
        type: 'GOAL',
        minute: 0,
        team: 'HOME',
        playerId: '',
        description: ''
      });
      setToast({ message: 'Event added successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to add event', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'GOAL':
        return '⚽';
      case 'YELLOW_CARD':
        return '🟨';
      case 'RED_CARD':
        return '🟥';
      case 'SUBSTITUTION':
        return '🔄';
      case 'INJURY':
        return '🏥';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Match Timeline</h3>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Add Event Form */}
      <div className="mb-6 p-4 border rounded-lg">
        <h4 className="font-medium mb-3">Add Event</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Event Type</label>
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="GOAL">Goal</option>
              <option value="YELLOW_CARD">Yellow Card</option>
              <option value="RED_CARD">Red Card</option>
              <option value="SUBSTITUTION">Substitution</option>
              <option value="INJURY">Injury</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Minute</label>
            <input
              type="number"
              value={newEvent.minute}
              onChange={(e) => setNewEvent(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Team</label>
            <select
              value={newEvent.team}
              onChange={(e) => setNewEvent(prev => ({ ...prev, team: e.target.value as 'HOME' | 'AWAY' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="HOME">{homeTeamName}</option>
              <option value="AWAY">{awayTeamName}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Player</label>
            <select
              value={newEvent.playerId}
              onChange={(e) => setNewEvent(prev => ({ ...prev, playerId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select player</option>
              {players
                .filter(player => 
                  newEvent.team === 'HOME' 
                    ? player.teamId === matchId.split('-')[0]
                    : player.teamId === matchId.split('-')[1]
                )
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600">Description (optional)</label>
            <input
              type="text"
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Add any additional details..."
            />
          </div>
        </div>
        <button
          onClick={handleAddEvent}
          disabled={loading || !newEvent.playerId || !newEvent.minute}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </div>

      {/* Timeline Display */}
      <div className="space-y-4">
        {events
          .sort((a, b) => a.minute - b.minute)
          .map((event) => (
            <div
              key={event.id}
              className={`flex items-center p-3 rounded-lg ${
                event.team === 'HOME' ? 'bg-blue-50' : 'bg-red-50'
              }`}
            >
              <span className="text-2xl mr-3">{getEventIcon(event.type)}</span>
              <div className="flex-1">
                <div className="font-medium">
                  {event.minute}' - {event.playerName}
                </div>
                <div className="text-sm text-gray-600">
                  {event.type.replace('_', ' ').toLowerCase()}
                  {event.description && ` - ${event.description}`}
                </div>
              </div>
              <div className="text-sm font-medium">
                {event.team === 'HOME' ? homeTeamName : awayTeamName}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 