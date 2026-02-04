# Local Setup Instructions for Silicon Technologies POS

This project is built using a modern Fullstack JavaScript stack (Node.js, Express, React, PostgreSQL). You can host it on your local machine by following these steps.

## Prerequisites

- **Node.js**: Version 18, 20, or 22 (LTS versions are highly recommended). Node.js 15 is not supported as it has reached End-of-Life and is incompatible with the build tools used in this project.
- **npm**: Usually comes with Node.js.
- **PostgreSQL**: A running PostgreSQL instance.

## Setup Steps

### 1. Clone or Download the Code
Download your project files from Replit to your local machine.

### 2. Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
```

### 3. Database Configuration
Create a PostgreSQL database for the project.

### 4. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
SESSION_SECRET=your_random_secret_string
NODE_ENV=development
```
*Note: Replace the `DATABASE_URL` with your actual local PostgreSQL connection string.*

### 5. Initialize Database Schema
Run the following command to push the schema to your local database:
```bash
npm run db:push
```

### 6. Authentication Note
This project currently uses **Replit Auth** for user identification. When running locally, the authentication flow might need to be adjusted or replaced with a standard authentication system (like Passport with local strategy) if you are not using Replit's OIDC provider.

### 7. Run the Application
For development mode with hot-reloading:
```bash
npm run dev
```
The application will be available at `http://localhost:5000`.

To build and run in production mode:
```bash
npm run build
npm start
```

## Troubleshooting
- Ensure PostgreSQL is running and accessible via the `DATABASE_URL`.
- If you encounter issues with Replit-specific integrations, you may need to refactor the `server/replit_integrations/` logic to use local alternatives.
