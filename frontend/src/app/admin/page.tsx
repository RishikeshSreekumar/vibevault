"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  // The actual auth check is handled by AdminLayout
  // This page assumes it's rendered within an authenticated context.

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 dark:text-sky-400 mb-6 sm:mb-8">
        Admin Dashboard
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Welcome to the admin area. From here you can manage the song directory.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-sky-600 dark:text-sky-300 mb-3">
            Manage Songs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View, edit, or delete existing song entries.
          </p>
          <Link href="/admin/songs" legacyBehavior>
            <a className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
              Go to Songs
            </a>
          </Link>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-sky-600 dark:text-sky-300 mb-3">
            Add New Song
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create a new entry in the song directory.
          </p>
          <Link href="/admin/songs/new" legacyBehavior>
            <a className="inline-block px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors">
              Add Song
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
