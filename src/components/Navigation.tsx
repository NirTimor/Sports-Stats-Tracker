'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Teams', href: '/teams' },
    { name: 'Players', href: '/players' },
    { name: 'Matches', href: '/matches' },
  ];

  if (status === "loading") {
    return <div className="bg-white shadow h-16 flex items-center px-4 sm:px-6 lg:px-8">Loading navigation...</div>;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Sports Stats Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {session &&
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
          </div>
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 