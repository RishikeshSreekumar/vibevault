export interface Song {
  id: string; // UUID
  title: string;
  singer: string;
  composer?: string | null;
  album?: string | null;
  youtube_link?: string | null;
  spotify_link?: string | null;
  apple_music_link?: string | null;
  release_date?: string | null; // Date as string
  genre?: string | null;
  cover_art_url?: string | null;
  lyrics?: string | null;
  created_at: string; // DateTime as string
  updated_at: string; // DateTime as string
}

export interface AdminSong extends Song {
  // Potentially admin-specific fields if any in future
}

// For creating songs, some fields might be optional or not present (like id, timestamps)
export type SongCreateInput = Omit<Song, 'id' | 'created_at' | 'updated_at'> & {
  // Ensure links are optional strings, Pydantic HttpUrl will handle backend validation
  youtube_link?: string;
  spotify_link?: string;
  apple_music_link?: string;
  cover_art_url?: string;
};

// For updating songs, all fields are optional
export type SongUpdateInput = Partial<SongCreateInput>;

// Matches backend's SongFilterParams schema for query parameters
export interface SongFilterParams {
  title?: string;
  singer?: string;
  album?: string;
  composer?: string;
  genre?: string;
  release_year?: number;
}

// Matches backend's PaginatedSongs response schema
export interface PaginatedSongs {
  total_count: number;
  songs: Song[];
}
