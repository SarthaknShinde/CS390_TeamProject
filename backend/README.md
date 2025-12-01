# World Cup Draw Simulator - Backend

MongoDB-based backend API for authentication (sign in and login).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
   - For local MongoDB: `mongodb://localhost:27017/world-cup-sim`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/world-cup-sim`

4. Set a secure JWT_SECRET in `.env`

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Returns: `{ "success": true, "token": "jwt-token", "user": {...} }`

- **POST** `/api/auth/login` - Login user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "success": true, "token": "jwt-token", "user": {...} }`

### Health Check

- **GET** `/` - API information
- **GET** `/health` - Health check endpoint

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
