"use client";
import { useState } from "react";
import React from 'react';
import TeamsManager from "./TeamsManager";
import PlayersManager from "./PlayersManager";
import MatchesManager from "./MatchesManager";

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white shadow rounded-lg p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="text-3xl font-bold text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
  </div>
);

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("teams");

  // Mock data for stats. In a real app, this would come from an API.
  const stats = {
    teams: 12,
    players: 150,
    matches: 48,
  };

  const tabs = [
    { id: 'teams', name: 'Teams' },
    { id: 'players', name: 'Players' },
    { id: 'matches', name: 'Matches' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Teams"
          value={stats.teams}
          icon={
            <div className="h-12 w-12 rounded-md bg-blue-500 text-white flex items-center justify-center">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          }
        />
        <StatCard
          title="Total Players"
          value={stats.players}
          icon={
            <div className="h-12 w-12 rounded-md bg-green-500 text-white flex items-center justify-center">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          }
        />
        <StatCard
          title="Matches Played"
          value={stats.matches}
          icon={
            <div className="h-12 w-12 rounded-md bg-indigo-500 text-white flex items-center justify-center">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          }
        />
      </div>

      {/* Tabs */}
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            onChange={(e) => setActiveTab(e.target.value)}
            value={activeTab}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 sm:p-6">
          {activeTab === 'teams' && <TeamsManager />}
          {activeTab === 'players' && <PlayersManager />}
          {activeTab === 'matches' && <MatchesManager />}
        </div>
      </div>

      {/* Logout button moved to Navbar */}
      {/* <div style={{marginTop: 40}}><LogoutButton /></div> */}

    </div>
  );
} 