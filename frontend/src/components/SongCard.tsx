import { Song } from "@/types";
import Link from "next/link";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 mb-6 w-full">
      <h2 className="text-2xl font-bold mb-2 text-sky-700 dark:text-sky-400">{song.title}</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
        <strong>Singer:</strong> {song.singer}
      </p>
      {song.album && (
        <p className="text-md text-gray-600 dark:text-gray-400 mb-1">
          <strong>Album:</strong> {song.album}
        </p>
      )}
      {song.composer && (
        <p className="text-md text-gray-600 dark:text-gray-400 mb-1">
          <strong>Composer:</strong> {song.composer}
        </p>
      )}
      {song.genre && (
        <p className="text-md text-gray-600 dark:text-gray-400 mb-1">
          <strong>Genre:</strong> {song.genre}
        </p>
      )}
      {song.release_date && (
        <p className="text-md text-gray-600 dark:text-gray-400 mb-3">
          <strong>Released:</strong> {new Date(song.release_date).toLocaleDateString()}
        </p>
      )}

      <div className="flex space-x-4 mb-4">
        {song.youtube_link && (
          <Link href={song.youtube_link} target="_blank" rel="noopener noreferrer"
             className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium">
            YouTube
          </Link>
        )}
        {song.spotify_link && (
          <Link href={song.spotify_link} target="_blank" rel="noopener noreferrer"
             className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 font-medium">
            Spotify
          </Link>
        )}
        {song.apple_music_link && (
          <Link href={song.apple_music_link} target="_blank" rel="noopener noreferrer"
             className="text-purple-600 hover:text-purple-700 dark:text-purple-500 dark:hover:text-purple-400 font-medium">
            Apple Music
          </Link>
        )}
      </div>

      {song.cover_art_url && (
        <div className="my-4">
          <img src={song.cover_art_url} alt={`${song.title} cover art`} className="rounded-md w-32 h-32 object-cover"/>
        </div>
      )}

      {/* Admin actions can be added here later, conditionally rendered */}
    </div>
  );
}
