import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Sports Stats Tracker
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Track and analyze your sports statistics across multiple sports. Perfect for teams and individual players.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Soccer Card */}
            <div className="bg-blue-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-white">Soccer</h3>
                <p className="mt-1 text-sm text-white">
                  Track goals, assists, and team performance
                </p>
                <div className="mt-4">
                  <Link
                    href="/soccer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Basketball Card */}
            <div className="bg-orange-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-white">Basketball</h3>
                <p className="mt-1 text-sm text-white">
                  Monitor points, rebounds, and assists
                </p>
                <div className="mt-4">
                  <Link
                    href="/basketball"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Tennis Card */}
            <div className="bg-green-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-white">Tennis</h3>
                <p className="mt-1 text-sm text-white">
                  Record aces, double faults, and match results
                </p>
                <div className="mt-4">
                  <Link
                    href="/tennis"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
