# IntelliDeFi Frontend

An intelligent DeFi investment platform that offers ETF-like portfolios tailored to different risk profiles. This project uses React with TypeScript and is containerized with Docker for easy development and deployment.

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Starting the Development Server

```bash
# Start with Docker
docker-compose up
```

The application will be available at http://localhost:3000

## 🔧 Development

### Project Structure

```
src/
├── components/        # UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and contract services
├── utils/             # Utility functions
├── constants/         # Constants and configuration
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

### Running Commands

To run commands inside the Docker container:

```bash
docker-compose exec intellidefi-frontend npm <command>
```

For example, to install a new package:

```bash
docker-compose exec intellidefi-frontend npm install <package-name>
```

### Available Scripts

- Start development server:

  ```bash
  docker-compose up
  ```

- Run tests:

  ```bash
  docker-compose exec intellidefi-frontend npm test
  ```

- Build for production:
  ```bash
  docker-compose run --rm intellidefi-frontend npm run build
  ```

## 🏗️ Building for Production

To build and run a production-optimized version:

1. Build the production Docker image:

   ```bash
   docker build -f Dockerfile.prod -t intellidefi-frontend:prod .
   ```

2. Run the production container:
   ```bash
   docker run -p 80:80 intellidefi-frontend:prod
   ```

The production build will be available at http://localhost
