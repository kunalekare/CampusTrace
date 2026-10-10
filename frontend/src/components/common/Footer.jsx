import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>Â© 2026 CampusTrace. Powered by Microsoft Azure (App Service, Azure SQL, Blob Storage, Application Insights).</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-800">Campus Safety Office</span>
          <span>â€¢</span>
          <span className="hover:text-slate-800">Security Hotline: (555) 019-2834</span>
        </div>
      </div>
    </footer>
  );
}