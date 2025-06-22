import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Sports Stats Tracker
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 sm:text-2xl">
              Professional-grade sports analytics platform. Track performance, analyze trends, and elevate your game across multiple sports.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Track Multiple Sports
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive statistics tracking for soccer, basketball, and tennis
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Soccer Card */}
            <div className="group relative bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20"></div>
              <div className="relative px-6 py-8">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Soccer</h3>
                <p className="text-blue-100 mb-6">
                  Track goals, assists, possession, shots, and team performance metrics
                </p>
                <ul className="text-blue-100 text-sm space-y-1 mb-6">
                  <li>• Goals & Assists tracking</li>
                  <li>• Possession & Shots analysis</li>
                  <li>• Team performance metrics</li>
                  <li>• Match timeline visualization</li>
                </ul>
                <Link
                  href="/soccer"
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Explore Soccer
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Basketball Card */}
            <div className="group relative bg-gradient-to-br from-orange-600 to-orange-800 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-orange-800/20"></div>
              <div className="relative px-6 py-8">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Basketball</h3>
                <p className="text-orange-100 mb-6">
                  Monitor points, rebounds, assists, and advanced basketball statistics
                </p>
                <ul className="text-orange-100 text-sm space-y-1 mb-6">
                  <li>• Points & Rebounds tracking</li>
                  <li>• Assists & Steals analysis</li>
                  <li>• Shooting percentages</li>
                  <li>• Player efficiency ratings</li>
                </ul>
                <Link
                  href="/basketball"
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Explore Basketball
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Tennis Card */}
            <div className="group relative bg-gradient-to-br from-green-600 to-green-800 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-800/20"></div>
              <div className="relative px-6 py-8">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tennis</h3>
                <p className="text-green-100 mb-6">
                  Record aces, double faults, and comprehensive tennis match statistics
                </p>
                <ul className="text-green-100 text-sm space-y-1 mb-6">
                  <li>• Aces & Double faults</li>
                  <li>• Serve percentages</li>
                  <li>• Winners & Unforced errors</li>
                  <li>• Break point analysis</li>
                </ul>
                <Link
                  href="/tennis"
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Explore Tennis
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Preview Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Powerful Analytics
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get insights that drive performance improvements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Stats</h3>
              <p className="text-gray-600">Track live performance metrics during matches</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Trends</h3>
              <p className="text-gray-600">Analyze progress over time with detailed charts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600">Manage players, teams, and match schedules</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
