# Social Media App

A simple social media application with features for user authentication, posting content, and interacting with posts.

## Features

- User signup and login with email and password
- Create posts with text and/or images
- View a feed of all posts
- Like and comment on posts
- Real-time updates of likes and comments

## Tech Stack

- Frontend: React.js with Material UI
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js installed
- MongoDB Atlas account (for cloud database) or MongoDB installed locally

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Database Setup (MongoDB Atlas)

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a new database user with read/write permissions
4. Whitelist your IP address (or allow access from anywhere for development)
5. Get your connection string from the "Connect" button
6. Update the `.env` file in the `backend` directory with your MongoDB connection string

### 4. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
# For MongoDB Atlas (cloud), use this format:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/socialmedia
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 5. Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server (in a separate terminal):
   ```bash
   cd frontend
   npm start
   ```

   Or build and serve the production version:
   ```bash
   cd frontend
   npm run build
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User signup
- POST `/api/auth/login` - User login

### Posts
- POST `/api/posts` - Create a new post
- GET `/api/posts` - Get all posts
- POST `/api/posts/:id/like` - Like/unlike a post
- POST `/api/posts/:id/comment` - Comment on a post

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Login.js
        │   ├── Signup.js
        │   ├── Feed.js
        │   └── CreatePost.js
        ├── App.js
        └── index.js
```

## Development

To run both frontend and backend concurrently (requires MongoDB Atlas or local MongoDB running):

```bash
npm start
```