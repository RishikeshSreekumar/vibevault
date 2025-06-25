from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
from .dependencies import get_api_key

# Create database tables if they don't exist (for development/simplicity)
# In production, you'd use Alembic migrations.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Song Directory API", version="0.1.0")

# --- Public Endpoints ---

@app.get("/songs/", response_model=schemas.PaginatedSongs, tags=["Songs"])
def read_songs(
    skip: int = 0,
    limit: int = 100,
    title: str = None,
    singer: str = None,
    album: str = None,
    composer: str = None,
    genre: str = None,
    release_year: int = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of songs with pagination and filtering.
    """
    filters = schemas.SongFilterParams(
        title=title,
        singer=singer,
        album=album,
        composer=composer,
        genre=genre,
        release_year=release_year
    )
    songs = crud.get_songs(db, filters=filters, skip=skip, limit=limit)
    total_count = crud.get_songs_count(db, filters=filters)
    return schemas.PaginatedSongs(total_count=total_count, songs=songs)

@app.get("/songs/{song_id}", response_model=schemas.Song, tags=["Songs"])
def read_song(song_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Retrieve a specific song by its ID.
    """
    db_song = crud.get_song(db, song_id=song_id)
    if db_song is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return db_song

# --- Admin Endpoints ---

@app.post("/songs/", response_model=schemas.Song, status_code=status.HTTP_201_CREATED, tags=["Admin"], dependencies=[Depends(get_api_key)])
def create_song_entry(song: schemas.SongCreate, db: Session = Depends(get_db)):
    """
    Create a new song entry. Requires admin authentication.
    """
    return crud.create_song(db=db, song=song)

@app.put("/songs/{song_id}", response_model=schemas.Song, tags=["Admin"], dependencies=[Depends(get_api_key)])
def update_song_entry(song_id: uuid.UUID, song_update: schemas.SongUpdate, db: Session = Depends(get_db)):
    """
    Update an existing song entry. Requires admin authentication.
    """
    db_song = crud.update_song(db, song_id=song_id, song_update=song_update)
    if db_song is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return db_song

@app.delete("/songs/{song_id}", response_model=schemas.Song, tags=["Admin"], dependencies=[Depends(get_api_key)])
def delete_song_entry(song_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Delete a song entry. Requires admin authentication.
    """
    db_song = crud.delete_song(db, song_id=song_id)
    if db_song is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return db_song

# Root endpoint for health check or basic info
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Song Directory API!"}

# Placeholder for __init__.py to make 'app' a package
# No content needed in __init__.py for this structure yet
# but will create it for completeness.
