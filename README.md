# vibevault

Vibevault is a full-stack application for managing and discovering songs. It consists of a backend API built with FastAPI and a frontend web application built with Next.js. Both services are containerized using Docker.

## Project Structure

-   `backend/`: Contains the FastAPI backend application.
    -   See `backend/README.md` for specific instructions on running the backend.
-   `frontend/`: Contains the Next.js frontend application.
    -   See `frontend/README.md` for specific instructions on running the frontend.
-   `docker-compose.yml`: Defines the services, networks, and volumes for running the application with Docker Compose.
-   `README.md`: This file, providing an overview of the project.

## Getting Started

The easiest way to get the entire application running is by using Docker Compose.

### Prerequisites

-   Docker
-   Docker Compose

### Running the Application

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Backend Configuration:**
    Navigate to the `backend` directory and create a `.env` file by copying the example or creating it from scratch. This file stores sensitive information and configurations for the backend.
    ```bash
    cd backend
    # Create .env with content like:
    # DATABASE_URL="postgresql://user:password@db:5432/songdb_dev"
    # ADMIN_API_KEY="your_secret_admin_key"
    cd ..
    ```
    Refer to `backend/README.md` for more details on these variables.

3.  **Build and Run with Docker Compose:**
    From the root project directory, run:
    ```bash
    docker-compose build
    docker-compose up -d
    ```
    This command will:
    -   Build the Docker images for the backend and frontend services.
    -   Start containers for the backend, frontend, and the PostgreSQL database.
    -   The `-d` flag runs the containers in detached mode.

4.  **Apply Backend Database Migrations:**
    After the services are up and running (especially the database), you need to apply the database migrations for the backend:
    ```bash
    docker-compose exec backend alembic upgrade head
    ```

5.  **Accessing the Services:**
    -   **Frontend:** Open your web browser and navigate to `http://localhost:3000`
    -   **Backend API Docs (Swagger UI):** Navigate to `http://localhost:8000/docs`

### Stopping the Application

To stop all running services, navigate to the root project directory and run:
```bash
docker-compose down
```
To stop and remove volumes (like the database data, be careful with this in production scenarios):
```bash
docker-compose down -v
```

## Development

The `docker-compose.yml` is set up to support development by mounting local code directories into the containers. This means changes made to your local `frontend/src` or `backend/app` directories should automatically be reflected by the respective services (often with hot-reloading).

-   For **frontend** development details, see `frontend/README.md`.
-   For **backend** development details, see `backend/README.md`.

## Further Information

For more detailed instructions on setting up, configuring, and running each part of the application, please refer to their respective README files:

-   [Backend README](./backend/README.md)
-   [Frontend README](./frontend/README.md)
