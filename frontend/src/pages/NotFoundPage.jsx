import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-7xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}