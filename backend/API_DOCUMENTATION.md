# Pet Adoption Platform API Documentation

Base URL: `https://your-api.render.com`

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Users & Authentication

### Register User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "bio": "Animal lover looking to adopt"
}
```

### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "0987654321",
  "bio": "Updated bio"
}
```

## Shelter User

### Create Shelter User
```http
POST /api/users
Content-Type: application/json

{
  "name": "Happy Paws Shelter",
  "email": "contact@happypaws.com",
  "password": "securepassword123",
  "role": "shelter",
  "phone": "1234567890",
  "address": {
    "street": "456 Shelter Lane",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "bio": "We are a no-kill shelter dedicated to finding forever homes for pets"
}
```

## Pets

### Create Pet Listing (Shelter Only)
```http
POST /api/pets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Max",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": {
    "value": 2,
    "unit": "years"
  },
  "size": "Large",
  "gender": "Male",
  "color": "Golden",
  "description": "Friendly and energetic Golden Retriever",
  "photos": [
    {
      "url": "https://example.com/photo1.jpg",
      "isMain": true
    }
  ],
  "adoptionFee": {
    "amount": 200,
    "currency": "USD"
  },
  "medical": {
    "vaccinated": true,
    "spayedNeutered": true,
    "microchipped": true
  },
  "behavior": {
    "goodWithChildren": true,
    "goodWithDogs": true,
    "goodWithCats": true,
    "energyLevel": "High"
  },
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA"
  }
}
```

### Get All Pets
```http
GET /api/pets
Query Parameters:
- status (Available, Pending, Adopted)
- species (Dog, Cat, etc.)
- breed
- size
- gender
- minAge
- maxAge
- city
- state
```

### Get Pet by ID
```http
GET /api/pets/:id
```

### Update Pet (Shelter Only)
```http
PUT /api/pets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Max Updated",
  "description": "Updated description"
}
```

### Search Pets
```http
GET /api/pets/search?q=golden+retriever
```

## Applications

### Submit Adoption Application
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "pet": "pet_id",
  "applicantInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "housingInfo": {
    "type": "House",
    "own": true,
    "hasYard": true,
    "hasChildren": false,
    "hasOtherPets": false
  },
  "lifestyle": {
    "hoursAlone": 6,
    "activityLevel": "Moderate",
    "primaryCaregiver": "Self"
  }
}
```

### Get User's Applications
```http
GET /api/applications/user
Authorization: Bearer <token>
```

### Get Shelter's Applications (Shelter Only)
```http
GET /api/applications/shelter
Authorization: Bearer <token>
Query Parameters:
- status
- page
- limit
```

### Update Application Status (Shelter Only)
```http
PUT /api/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Approved",
  "message": "Your application has been approved!"
}
```

## Reviews

### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "shelter",
  "shelter": "shelter_id",
  "rating": 5,
  "title": "Great experience!",
  "content": "Very professional and caring shelter."
}
```

### Get Shelter Reviews
```http
GET /api/reviews/shelter/:shelterId
Query Parameters:
- page
- limit
```

### Add Review Response (Shelter Only)
```http
POST /api/reviews/:id/response
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Thank you for your feedback!"
}
```

## Messages

### Create Conversation
```http
POST /api/messages/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipient": "recipient_id",
  "subject": "Question about Max",
  "initialMessage": "Hi, I'm interested in adopting Max"
}
```

### Send Message
```http
POST /api/messages/conversations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "When can I come to meet the pet?"
}
```

### Get User Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>
```

## Foster Applications

### Submit Foster Application
```http
POST /api/fosters
Authorization: Bearer <token>
Content-Type: application/json

{
  "pet": "pet_id",
  "startDate": "2024-02-01",
  "endDate": "2024-03-01",
  "notes": "I can foster for one month"
}
```

### Get User's Foster Applications
```http
GET /api/fosters/user
Authorization: Bearer <token>
```

### Complete home check (shelter only)
```http
PUT /api/fosters/:id/homecheck
Authorization: Bearer <token>
Content-Type: application/json

{
  "passed": true,
  "comments": "Home environment is suitable for fostering. Spacious yard, secure fencing, and clean living conditions. All safety requirements met."
}
```

### Update Foster Status (Shelter Only)
```http
PUT /api/fosters/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Approved",
  "feedback": {
    "comments": "Application approved"
  }
}
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Pagination Format
For endpoints that support pagination:
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  },
  "data": []
}
```