# Frontend

This document describes how to set up and run the frontend service.

## Prerequisites

- Docker
- Docker Compose

## Setup and Running

1.  **Environment Configuration:**
    The frontend requires the `NEXT_PUBLIC_API_URL` environment variable to be set. This variable tells the Next.js application where the backend API is located.

    In the `docker-compose.yml` file (located in the project root), this is typically set for the `frontend` service:
    ```yaml
    services:
      frontend:
        # ... other configurations
        environment:
          - NEXT_PUBLIC_API_URL=http://backend:8000
          - NODE_ENV=development # Or 'production'
        # ... other configurations
    ```
    The value `http://backend:8000` refers to the backend service name within the Docker network. When accessing from your browser, the frontend will run on `http://localhost:3000` and will make requests to the backend via the Docker network.

    If you are running the frontend outside of the provided Docker Compose setup (e.g., locally for development without Docker), you would need to set this environment variable accordingly. For example, in a local `.env.local` file in the `frontend` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```
    However, for the Docker-based setup, the `docker-compose.yml` configuration is the primary place for this.

2.  **Build and Run with Docker Compose:**
    From the root project directory, run the following commands:

    ```bash
    docker-compose build frontend
    docker-compose up -d frontend
    ```
    If you want to run all services defined in `docker-compose.yml` (including the database and backend), you can simply run:
    ```bash
    docker-compose build
    docker-compose up -d
    ```

3.  **Accessing the Frontend:**
    The frontend application will be available at `http://localhost:3000`.

## Development

For development, the `docker-compose.yml` file is configured to mount the local `frontend` directory into the container. This allows for hot-reloading, so changes you make to the code in the `frontend/src` directory should be reflected in your browser automatically.

-   **Local `node_modules`**: The Dockerfile for the frontend service runs `npm install`. The `docker-compose.yml` includes a volume mount for `/app/node_modules` to prevent the local `node_modules` (if any) from overwriting the one installed in the container. This is a common practice to ensure consistency.
-   **Build artifacts (`.next`)**: Similarly, `/app/.next` is also defined as a volume to ensure the container's build artifacts are used and not overwritten by local ones.

If you need to install new npm packages:
1. Add the dependency to `frontend/package.json`.
2. Rebuild the frontend image: `docker-compose build frontend`
3. Restart the services: `docker-compose up -d` (or `docker-compose up` to see logs)

## Environment Variables

-   `NEXT_PUBLIC_API_URL`: (Required) The URL of the backend API. This is used by the Next.js application to fetch data. Example: `http://backend:8000` (within Docker network) or `http://localhost:8000` (if backend is run locally and accessed directly).
-   `NODE_ENV`: Set to `development` for development builds/runs, or `production` for production. This affects Next.js's behavior (e.g., optimizations, error details).

Refer to the main `docker-compose.yml` file in the project root for more details on service configurations and network settings.
