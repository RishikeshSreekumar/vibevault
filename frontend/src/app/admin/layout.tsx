"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Changed from "next/navigation"
import { useEffect, useState } from "react";

// This would ideally come from an environment variable
const ADMIN_API_KEY_STORAGE_KEY = "admin_api_key";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY);
    if (!storedApiKey) {
      router.push("/admin/login");
    } else {
      setApiKey(storedApiKey);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_API_KEY_STORAGE_KEY);
    setApiKey(null);
    router.push("/admin/login");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading admin area...</p></div>;
  }

  if (!apiKey && typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
    // This check might be redundant due to the useEffect redirect, but acts as a safeguard
    return null; // Or a loading/redirecting message
  }

  // Do not render layout if on login page and not yet authenticated
  if (typeof window !== 'undefined' && window.location.pathname === '/admin/login' && !apiKey) {
    return <>{children}</>;
  }


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <nav className="bg-sky-700 dark:bg-sky-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold hover:text-sky-200">
            Admin Panel
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-sky-200">Public Site</Link>
            <Link href="/admin/songs" className="hover:text-sky-200">Manage Songs</Link>
            <Link href="/admin/songs/new" className="hover:text-sky-200">Add New Song</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 sm:p-6">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-300 dark:border-slate-700 mt-8">
        Song Directory Admin
      </footer>
    </div>
  );
}
