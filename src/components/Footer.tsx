import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm text-gray-500 text-center sm:text-left">
          &copy; {new Date().getFullYear()} Sports Stats Tracker. All Rights Reserved.
        </p>
        <p className="text-sm text-gray-500">
          Made with <span className="passion-text">passion</span> by <span className="font-mono text-indigo-600 font-semibold tracking-wide">NiroT</span>
        </p>
      </div>
    </footer>
  );
} 