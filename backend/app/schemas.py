from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import date, datetime
import uuid

class SongBase(BaseModel):
    title: str
    singer: str
    composer: Optional[str] = None
    album: Optional[str] = None
    youtube_link: Optional[HttpUrl] = None
    spotify_link: Optional[HttpUrl] = None
    apple_music_link: Optional[HttpUrl] = None
    release_date: Optional[date] = None
    genre: Optional[str] = None
    cover_art_url: Optional[HttpUrl] = None
    lyrics: Optional[str] = None

class SongCreate(SongBase):
    pass

class SongUpdate(SongBase):
    title: Optional[str] = None # Allow partial updates
    singer: Optional[str] = None # Allow partial updates
    # All other fields are already optional in SongBase

class Song(SongBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # Changed from from_attributes = True for Pydantic v1 compatibility
        # if using Pydantic v2, it would be:
        # from_attributes = True

# For query parameters in the GET /songs/ endpoint
class SongFilterParams(BaseModel):
    title: Optional[str] = None
    singer: Optional[str] = None
    album: Optional[str] = None
    composer: Optional[str] = None
    genre: Optional[str] = None
    release_year: Optional[int] = None

# New response model for paginated songs
class PaginatedSongs(BaseModel):
    total_count: int
    songs: list[Song]
