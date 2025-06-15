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
    <nav className="bg-primary-blue shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="main-title font-bold text-[#ffffff] hover:text-[#2563eb] hover:border-[#2563eb]">
                Sports Stats Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {session &&
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200
                      ${pathname === item.href
                        ? 'text-[#ffffff] border-[#ffffff]' // Active
                        : 'text-gray-500 border-transparent hover:text-[#ffffff] hover:border-[#2563eb]' // Hover
                      }`}


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
                background: "#f44336",
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