from sqlalchemy import Column, String, Text, Date, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Song(Base):
    __tablename__ = "songs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    singer = Column(String, nullable=False)
    composer = Column(String, nullable=True)
    album = Column(String, nullable=True)
    youtube_link = Column(String, nullable=True) # Store as String, validation by Pydantic
    spotify_link = Column(String, nullable=True) # Store as String, validation by Pydantic
    apple_music_link = Column(String, nullable=True) # Store as String, validation by Pydantic
    release_date = Column(Date, nullable=True)
    genre = Column(String, nullable=True)
    cover_art_url = Column(String, nullable=True) # Store as String, validation by Pydantic
    lyrics = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
