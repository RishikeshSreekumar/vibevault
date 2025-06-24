"use client";

import { Song, SongCreateInput, SongUpdateInput } from "@/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

interface SongFormProps {
  initialData?: Song; // For editing
  apiKey: string | null;
  isEditMode: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SongForm({ initialData, apiKey, isEditMode }: SongFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<SongCreateInput>>({
    title: "",
    singer: "",
    composer: "",
    album: "",
    youtube_link: "",
    spotify_link: "",
    apple_music_link: "",
    release_date: "", // Store as YYYY-MM-DD string
    genre: "",
    cover_art_url: "",
    lyrics: "",
    ...initialData,
    // Ensure date is formatted correctly if initialData is present
    release_date: initialData?.release_date ? new Date(initialData.release_date).toISOString().split('T')[0] : "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        release_date: initialData.release_date ? new Date(initialData.release_date).toISOString().split('T')[0] : "",
      });
    }
  }, [initialData]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value }_ = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError("API Key is missing. Please login again.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `${API_BASE_URL}/songs/${initialData?.id}`
      : `${API_BASE_URL}/songs/`;

    // Prepare payload: Pydantic expects HttpUrl to be valid URLs or null.
    // Ensure empty strings for optional URL fields are sent as null if backend expects that,
    // or ensure your Pydantic model handles empty strings appropriately (e.g. converts to None).
    // For now, sending them as is, assuming Pydantic handles empty string for Optional[HttpUrl].
    // If not, convert empty strings to null for link fields.
    const payload = { ...formData };
    if (payload.release_date === "") {
        payload.release_date = null; // Send null if date is empty
    }


    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "An unknown error occurred during submission." }));
        throw new Error(errorData.detail || `Failed to ${isEditMode ? 'update' : 'create'} song. Status: ${response.status}`);
      }

      const result = await response.json();
      setSuccessMessage(`Song successfully ${isEditMode ? 'updated' : 'created'}! ID: ${result.id}`);
      setIsLoading(false);

      if (!isEditMode) { // If creating, redirect to edit page of the new song or song list
        router.push(`/admin/songs/${result.id}/edit`); // Or router.push('/admin/songs');
      } else {
        // Optionally refresh data or show message
         router.refresh(); // Refreshes server components, refetches data for current page
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An unknown error occurred: ${String(err)}`);
      }
      setIsLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-sky-700 dark:text-sky-400 mb-6">
        {isEditMode ? "Edit Song" : "Add New Song"}
      </h2>

      {error && <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-md">{error}</div>}
      {successMessage && <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 rounded-md">{successMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className={labelClass}>Title <span className="text-red-500">*</span></label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="singer" className={labelClass}>Singer <span className="text-red-500">*</span></label>
          <input type="text" name="singer" id="singer" value={formData.singer} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="composer" className={labelClass}>Composer</label>
          <input type="text" name="composer" id="composer" value={formData.composer || ""} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="album" className={labelClass}>Album</label>
          <input type="text" name="album" id="album" value={formData.album || ""} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="release_date" className={labelClass}>Release Date</label>
          <input type="date" name="release_date" id="release_date" value={formData.release_date || ""} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="genre" className={labelClass}>Genre</label>
          <input type="text" name="genre" id="genre" value={formData.genre || ""} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="youtube_link" className={labelClass}>YouTube Link</label>
          <input type="url" name="youtube_link" id="youtube_link" value={formData.youtube_link || ""} onChange={handleChange} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label htmlFor="spotify_link" className={labelClass}>Spotify Link</label>
          <input type="url" name="spotify_link" id="spotify_link" value={formData.spotify_link || ""} onChange={handleChange} className={inputClass} placeholder="https://open.spotify.com/track/..." />
        </div>
        <div>
          <label htmlFor="apple_music_link" className={labelClass}>Apple Music Link</label>
          <input type="url" name="apple_music_link" id="apple_music_link" value={formData.apple_music_link || ""} onChange={handleChange} className={inputClass} placeholder="https://music.apple.com/..." />
        </div>
        <div>
          <label htmlFor="cover_art_url" className={labelClass}>Cover Art URL</label>
          <input type="url" name="cover_art_url" id="cover_art_url" value={formData.cover_art_url || ""} onChange={handleChange} className={inputClass} placeholder="https://example.com/image.jpg" />
        </div>
      </div>

      <div>
        <label htmlFor="lyrics" className={labelClass}>Lyrics</label>
        <textarea name="lyrics" id="lyrics" rows={6} value={formData.lyrics || ""} onChange={handleChange} className={`${inputClass} min-h-[100px]`}></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={() => router.back()} disabled={isLoading}
                className="px-5 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading}
                className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 dark:disabled:bg-sky-800">
          {isLoading ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Song")}
        </button>
      </div>
    </form>
  );
}
