# Stage 1: Build stage (if needed, e.g., for compiling assets or multi-stage builds)
# For a simple Python app, a single stage is often fine.

# Official Python runtime as a parent image
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies (if any, e.g., for psycopg2 build from source if not using -binary)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
#    && rm -rf /var/lib/apt/lists/*
# psycopg2-binary is used, so the above is likely not needed unless other C extensions are.

# Install pip dependencies
# Copy only requirements.txt first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8000 for FastAPI/Uvicorn
EXPOSE 8000

# Command to run the application using Uvicorn
# The app.main:app refers to the `app` instance in the `main.py` file inside the `app` directory.
# Alembic migrations should be run as part of the entrypoint or a separate command.
# For simplicity in this Dockerfile, we assume migrations are handled before starting,
# or via an entrypoint script in a more complex setup.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
