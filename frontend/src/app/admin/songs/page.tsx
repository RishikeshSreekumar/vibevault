"use client";

import { Song } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_API_KEY_STORAGE_KEY = "admin_api_key";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ManageSongsPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; songId: string | null }>({ show: false, songId: null });


  useEffect(() => {
    const storedKey = localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY);
    if (!storedKey) {
      router.push("/admin/login");
    } else {
      setApiKey(storedKey);
    }
  }, [router]);

  const fetchSongs = async () => {
    if (!apiKey) return; // Should not happen if layout/auth works
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/songs/?limit=200`, { // Fetch more for admin view
        // No API key needed for public GET, but if it were a protected GET:
        // headers: { "X-API-KEY": apiKey }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch songs. Status: ${response.status}`);
      }
      const data: Song[] = await response.json();
      setSongs(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching songs.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      fetchSongs();
    }
  }, [apiKey]); // Re-fetch if API key becomes available (e.g., after login redirect)

  const handleDeleteClick = (songId: string) => {
    setDeleteConfirmation({ show: true, songId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.songId || !apiKey) return;
    setIsLoading(true); // Can use a more specific loading state for delete
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${deleteConfirmation.songId}`, {
        method: "DELETE",
        headers: {
          "X-API-KEY": apiKey,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({detail: "Unknown error during delete."}));
        throw new Error(errorData.detail || `Failed to delete song. Status: ${response.status}`);
      }
      setSongs(songs.filter(s => s.id !== deleteConfirmation.songId)); // Optimistic update or refetch
      // fetchSongs(); // Or refetch the list
    } catch (err) {
       if (err instanceof Error) {
        setError(err.message); // Show error to user
      } else {
        setError("An unknown error occurred during deletion.");
      }
    } finally {
      setDeleteConfirmation({ show: false, songId: null });
      setIsLoading(false);
    }
  };

  if (!apiKey && typeof window !== 'undefined') { // Avoid flash of content if not logged in
     return <div className="text-center p-8">Redirecting to login...</div>;
  }

  if (isLoading && songs.length === 0) { // Show loading only on initial load
    return <div className="text-center p-8">Loading songs...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-md m-4">{error} <button onClick={fetchSongs} className="ml-2 px-2 py-1 bg-red-200 dark:bg-red-700 rounded">Retry</button></div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-700 dark:text-sky-400">Manage Songs</h1>
        <Link href="/admin/songs/new" legacyBehavior>
          <a className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-150">
            Add New Song
          </a>
        </Link>
      </div>

      {songs.length === 0 && !isLoading && (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">No songs found.</p>
      )}

      {songs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Singer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Album</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{song.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{song.singer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{song.album || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/admin/songs/${song.id}/edit`} legacyBehavior>
                      <a className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</a>
                    </Link>
                    <button onClick={() => handleDeleteClick(song.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this song? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteConfirmation({ show: false, songId: null })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isLoading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium disabled:bg-red-300 dark:disabled:bg-red-800">
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
