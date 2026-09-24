# DSA Tracker API Documentation

## Overview
This document describes the APIs available in the DSA Tracker application, which is primarily an authentication system.

## Base URL
```
http://localhost:7200
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Upon successful login or registration, an HTTP-only cookie is set containing the JWT token.

## Endpoints

### Auth Endpoints

#### Register a New User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user in the system
- **Request Body**:
  ```json
  {
    "name": "string (required, min 3 characters)",
    "email": "string (required, valid email format)",
    "password": "string (required, min 6 characters)"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "_id": "string (MongoDB ObjectId)",
        "name": "string",
        "email": "string"
      }
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Missing/invalid fields, user already exists
  - 500 Internal Server Error: Server error

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Logs in an existing user
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email format)",
    "password": "string (required)"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "user": {
        "_id": "string (MongoDB ObjectId)",
        "name": "string",
        "email": "string"
      }
    }
    ```
  - **Note**: Sets HTTP-only cookie with JWT token
- **Error Responses**:
  - 400 Bad Request: Missing fields, invalid email, user not found, invalid password
  - 500 Internal: Server error

## Protected Routes
The application includes an authentication middleware that protects routes. Any route that requires authentication should:
1. Include the access token in either:
   - Cookie: `accessToken` or `jwt`
   - Authorization header: `Bearer <token>`

## Data Model
The User schema includes:
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `timestamps`: CreatedAt and UpdatedAt

## Pre-seeded Example Data
For testing purposes, you can use the following example data in the Postman collection:

**Registration:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Login:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

## Setup Instructions
1. Install dependencies: `npm install`
2. Set up environment variables (copy .env.example to .env and fill in values)
3. Start the server: `npm start` or `node server.js`
4. Import the Postman collection (`DSA_Tracker_API.postman_collection.json`) into Postman
5. Use the example requests to test the API

## Environment Variables Required
- `PORT`: Server port (default: 7200)
- `NODE_ENV`: Environment (development/production)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `CORS_URL`: CORS allowed origin (default: "*")

## Notes
- Passwords are hashed using bcrypt before storage
- JWT tokens expire in 1 hour
- Input sanitization is applied to prevent XSS attacks
- CORS is enabled for frontend integration