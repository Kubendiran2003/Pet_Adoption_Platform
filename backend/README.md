# Pet Adoption Platform API

A comprehensive backend API for a pet adoption platform built with the MERN stack. This API provides all the necessary endpoints for managing pet listings, adoption applications, user reviews, messaging, and pet fostering.

## Features

- **User Management**: Registration, authentication, profile management
- **Pet Listings**: Create, read, update, delete pet profiles with detailed information
- **Application Management**: Submit and track adoption applications
- **Review System**: Leave and manage reviews for shelters and pets
- **Messaging System**: Direct communication between adopters and shelters
- **Fostering System**: Apply for and manage foster arrangements
- **Search & Filtering**: Advanced search capabilities for finding pets

## Tech Stack

- **MongoDB**: Database for storing all application data
- **Express**: Backend framework for creating RESTful API
- **Node.js**: JavaScript runtime for the server
- **JWT**: Authentication using JSON Web Tokens
- **Nodemailer**: Email notifications for application updates and messages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository

```
git clone <repository-url>
```

2. Install dependencies

```
npm install
```

3. Configure environment variables

```
cp .env.example .env
```

Then edit the `.env` file with your configuration values.

4. Start the development server

```
npm run dev
```

## API Documentation

[View PostMan Docs](https://documenter.getpostman.com/view/44150102/2sB2qUm3zo).

### Authentication

- POST `/api/users` - Register a new user
- POST `/api/users/login` - Log in and get token

### Users

- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/shelters` - Get all shelters
- GET `/api/users/shelters/:id` - Get shelter by ID

### Pets

- GET `/api/pets` - Get all pets with filtering
- GET `/api/pets/:id` - Get pet by ID
- POST `/api/pets` - Create new pet (shelter only)
- PUT `/api/pets/:id` - Update pet (shelter only)
- DELETE `/api/pets/:id` - Delete pet (shelter only)
- GET `/api/pets/search` - Search for pets
- GET `/api/pets/shelter/:shelterId` - Get pets from a shelter
- PUT `/api/pets/:id/photos` - Update pet photos (shelter only)
- PUT `/api/pets/:id/status` - Update pet status (shelter only)

### Applications

- POST `/api/applications` - Submit new application
- GET `/api/applications/user` - Get user's applications
- GET `/api/applications/shelter` - Get shelter's applications (shelter only)
- GET `/api/applications/:id` - Get application by ID
- PUT `/api/applications/:id/status` - Update application status (shelter only)
- POST `/api/applications/:id/notes` - Add note to application
- POST `/api/applications/:id/meeting` - Schedule a meeting (shelter only)
- PUT `/api/applications/:id/withdraw` - Withdraw application

### Reviews

- POST `/api/reviews` - Create new review
- GET `/api/reviews/shelter/:shelterId` - Get shelter reviews
- GET `/api/reviews/pet/:petId` - Get pet reviews
- PUT `/api/reviews/:id` - Update review
- DELETE `/api/reviews/:id` - Delete review
- POST `/api/reviews/:id/response` - Add response to review (shelter only)
- POST `/api/reviews/:id/helpful` - Mark review as helpful
- PUT `/api/reviews/:id/approve` - Approve/disapprove review (admin only)

### Messages

- GET `/api/messages/conversations` - Get user conversations
- GET `/api/messages/conversations/:id` - Get conversation by ID
- POST `/api/messages/conversations` - Create new conversation
- POST `/api/messages/conversations/:id` - Send message to conversation
- DELETE `/api/messages/conversations/:id` - Archive conversation
- GET `/api/messages/unread` - Get unread message count

### Fostering

- POST `/api/fosters` - Submit foster application
- GET `/api/fosters/user` - Get user's foster applications
- GET `/api/fosters/shelter` - Get shelter's foster applications (shelter only)
- GET `/api/fosters/:id` - Get foster application by ID
- PUT `/api/fosters/:id/status` - Update foster status (shelter only)
- POST `/api/fosters/:id/homecheck` - Schedule home check (shelter only)
- PUT `/api/fosters/:id/homecheck` - Complete home check (shelter only)
- POST `/api/fosters/:id/feedback` - Submit foster feedback

## Deployment

This API can be deployed to Render.com:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the build command: `npm install`
4. Configure the start command: `npm start`
5. Add environment variables from your `.env` file
6. Deploy!

## License

This project is licensed under the MIT License.
