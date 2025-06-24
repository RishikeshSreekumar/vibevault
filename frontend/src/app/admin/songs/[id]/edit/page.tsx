"use client";

import SongForm from "@/components/admin/SongForm";
import { Song } from "@/types";
import { useParams, useRouter } from "next/navigation"; // Corrected import
import { useEffect, useState } from "react";

const ADMIN_API_KEY_STORAGE_KEY = "admin_api_key";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EditSongPage() {
  const params = useParams();
  const songId = params.id as string; // Extract ID from route parameters
  const router = useRouter();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY);
    if (!storedKey) {
      router.push("/admin/login");
    } else {
      setApiKey(storedKey);
    }
  }, [router]);

  useEffect(() => {
    if (songId && apiKey) {
      const fetchSong = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
            headers: {
              // No API key needed for public GET, but if it were a protected GET:
              // "X-API-KEY": apiKey,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch song data (ID: ${songId}). Status: ${response.status}`);
          }
          const data: Song = await response.json();
          setSong(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred while fetching song data.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchSong();
    }
  }, [songId, apiKey]);

  if (!apiKey) {
     return <div className="text-center p-8">Redirecting to login...</div>;
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading song details...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-md m-4">{error}</div>;
  }

  if (!song) {
    return <div className="text-center p-8">Song not found or could not be loaded.</div>;
  }

  return (
    <div>
      <SongForm initialData={song} apiKey={apiKey} isEditMode={true} />
    </div>
  );
}
