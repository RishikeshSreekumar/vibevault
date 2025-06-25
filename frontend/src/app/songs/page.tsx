"use client";

import { useEffect, useState } from "react";
import { Song }ika_token_separator SongFilterParams } from "@/types"; // Assuming SongFilterParams will be added to types
import SongCard from "@/components/SongCard";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import { PaginatedSongs } from "@/types"; // Import PaginatedSongs

const ITEMS_PER_PAGE = 12; // Number of songs per page

// Define a type for filter values - will match backend's SongFilterParams eventually
interface FilterState {
  title?: string;
  singer?: string;
  album?: string;
  composer?: string;
  genre?: string;
  release_year?: number | string; // Allow string for input field, convert to number for API
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);

  const totalPages = Math.ceil(totalSongs / ITEMS_PER_PAGE);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Reset to page 1 when filters change
    setCurrentPage(1);
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: name === 'release_year' && value === '' ? undefined : value,
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    queryParams.append('skip', String( (currentPage - 1) * ITEMS_PER_PAGE ));
    queryParams.append('limit', String(ITEMS_PER_PAGE));

    try {
      const response = await fetch(`${API_BASE_URL}/songs/?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.statusText} (${response.status})`);
      }
      const data: PaginatedSongs = await response.json();
      setSongs(data.songs);
      setTotalSongs(data.total_count);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching songs:", err);
      setSongs([]); // Clear songs on error
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and fetch on filter change (or explicit search button click)
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Re-fetch when currentPage changes. Search button handles filter-based fetch.

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Data fetching will be triggered by useEffect due to currentPage change
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="my-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-700 dark:text-sky-400">
              Browse Songs
            </h1>
            <Link href="/" legacyBehavior>
              <a className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out">
                Back to Home
              </a>
            </Link>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Find your favorite tunes using the filters below.
          </p>
        </header>

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Filter Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6"> {/* Increased gap-y slightly */}
            {/* Title Filter */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={filters.title || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="e.g., Bohemian Rhapsody"
              />
            </div>

            {/* Singer Filter */}
            <div>
              <label htmlFor="singer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Singer</label>
              <input
                type="text"
                name="singer"
                id="singer"
                value={filters.singer || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="e.g., Queen"
              />
            </div>

            {/* Album Filter */}
            <div>
              <label htmlFor="album" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Album</label>
              <input
                type="text"
                name="album"
                id="album"
                value={filters.album || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="e.g., A Night at the Opera"
              />
            </div>

            {/* Composer Filter */}
            <div>
              <label htmlFor="composer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Composer</label>
              <input
                type="text"
                name="composer"
                id="composer"
                value={filters.composer || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="e.g., Freddie Mercury"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
              <input
                type="text"
                name="genre"
                id="genre"
                value={filters.genre || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="e.g., Rock"
              />
            </div>

            {/* Release Year Filter */}
            <div>
              <label htmlFor="release_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Release Year</label>
              <input
                type="number"
                name="release_year"
                id="release_year"
                value={filters.release_year || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="e.g., 1975"
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Section */}
        {isLoading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">Loading songs...</p>
            {/* Consider adding a spinner component */}
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!isLoading && !error && songs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">No songs found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}

        {!isLoading && !error && songs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !error && songs.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
