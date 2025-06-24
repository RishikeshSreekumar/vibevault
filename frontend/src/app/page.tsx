"use client"; // This directive makes it a Client Component

import { useEffect, useState } from "react";
import { Song } from "@/types";
import SongCard from "@/components/SongCard";
import Link from "next/link";

// Assume the backend API is running on port 8000
// In a real setup, this would come from an environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/songs/?skip=0&limit=100`);
        if (!response.ok) {
          throw new Error(`Failed to fetch songs: ${response.statusText}`);
        }
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching songs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="my-8 text-center">
          <h1 className="text-5xl font-extrabold text-sky-700 dark:text-sky-400">
            Song Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Browse your favorite tunes.
          </p>
          <div className="mt-4">
            <Link href="/admin" legacyBehavior>
              <a className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out">
                Admin Panel
              </a>
            </Link>
          </div>
        </header>

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">Loading songs...</p>
            {/* You can add a spinner component here */}
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!isLoading && !error && songs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">No songs found. Add some in the admin panel!</p>
          </div>
        )}

        {!isLoading && !error && songs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
