# Backend

This document describes how to set up and run the backend service.

## Prerequisites

- Docker
- Docker Compose

## Setup and Running

1.  **Create a `.env` file:**
    In the `backend` directory, create a file named `.env`. This file will contain environment variables necessary for the application.

    ```env
    DATABASE_URL="postgresql://user:password@db:5432/songdb_dev"
    ADMIN_API_KEY="your_secret_admin_key"
    ```

    -   `DATABASE_URL`: The connection string for the PostgreSQL database. The default values match the `docker-compose.yml` configuration.
    -   `ADMIN_API_KEY`: A secret key for administrative access to the API. Choose a strong, unique key.

2.  **Build and Run with Docker Compose:**
    From the root project directory, run the following commands:

    ```bash
    docker-compose build backend
    docker-compose up -d backend
    ```
    If you want to run all services defined in `docker-compose.yml` (including the database and frontend), you can simply run:
    ```bash
    docker-compose build
    docker-compose up -d
    ```

3.  **Apply Database Migrations:**
    Once the database container is up and healthy, and the backend service is running, you need to apply the database migrations. Open a new terminal and run:

    ```bash
    docker-compose exec backend alembic upgrade head
    ```

    This command executes the Alembic migration scripts to set up the necessary database tables.

4.  **Accessing the API:**
    The backend API will be available at `http://localhost:8000`.
    You can access the API documentation (Swagger UI) at `http://localhost:8000/docs`.

## Development

For development, the `docker-compose.yml` file is configured to mount the local `backend` directory into the container. This means changes you make to the code will be reflected automatically, and the server will reload (if using the development command `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`).

If the `docker-compose.yml` is not using the reload command, you might need to restart the backend service to see changes:
```bash
docker-compose restart backend
```

## Environment Variables

-   `DATABASE_URL`: Specifies the connection URL for the database.
-   `ADMIN_API_KEY`: Secret key for admin operations.
-   `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: These are used by the `db` service in `docker-compose.yml` to initialize the PostgreSQL database. The `DATABASE_URL` should correspond to these values.

Refer to the main `docker-compose.yml` file in the project root for more details on service configurations and network settings.
