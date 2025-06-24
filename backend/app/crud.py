from sqlalchemy.orm import Session
from . import models, schemas
import uuid

def get_song(db: Session, song_id: uuid.UUID):
    return db.query(models.Song).filter(models.Song.id == song_id).first()

def get_songs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Song).offset(skip).limit(limit).all()

def create_song(db: Session, song: schemas.SongCreate):
    db_song = models.Song(
        title=song.title,
        singer=song.singer,
        composer=song.composer,
        album=song.album,
        youtube_link=str(song.youtube_link) if song.youtube_link else None,
        spotify_link=str(song.spotify_link) if song.spotify_link else None,
        apple_music_link=str(song.apple_music_link) if song.apple_music_link else None,
        release_date=song.release_date,
        genre=song.genre,
        cover_art_url=str(song.cover_art_url) if song.cover_art_url else None,
        lyrics=song.lyrics
    )
    db.add(db_song)
    db.commit()
    db.refresh(db_song)
    return db_song

def update_song(db: Session, song_id: uuid.UUID, song_update: schemas.SongUpdate):
    db_song = get_song(db, song_id)
    if not db_song:
        return None

    update_data = song_update.dict(exclude_unset=True) # Use model_dump in Pydantic v2
    for key, value in update_data.items():
        if value is not None: # Ensure HttpUrl is converted to string if present
            if key in ["youtube_link", "spotify_link", "apple_music_link", "cover_art_url"] and value:
                 setattr(db_song, key, str(value))
            else:
                setattr(db_song, key, value)

    db.commit()
    db.refresh(db_song)
    return db_song

def delete_song(db: Session, song_id: uuid.UUID):
    db_song = get_song(db, song_id)
    if not db_song:
        return None
    db.delete(db_song)
    db.commit()
    return db_song
