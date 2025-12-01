# Quick Start Guide - youGO Flight Booking Platform

## Prerequisites
- Node.js installed (v14 or higher)
- AWS account with DynamoDB access
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Start Backend Server
Open a terminal and run:
```bash
cd backend
npm start
```

The backend will start on `http://localhost:3000`

### 4. Start Frontend Server
Open another terminal and run:
```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` (or another port if 3000 is taken)

## Testing the Application

### As a User:
1. Open the application in your browser
2. Click on "Sign Up" tab
3. Create a new account (name, email, password)
4. After signup, you'll be logged in automatically
5. Browse available flights
6. Click "Book Now" on any flight
7. Fill in passenger details and confirm booking
8. View your bookings and tickets

### As an Admin:
1. Open the application in your browser
2. Click on "Admin" tab
3. Login with:
   - Email: `admin123@gmail.com`
   - Password: `admin@321`
4. Add new flights using "Add New Flight" button
5. View all bookings in the "Bookings" tab
6. Edit or delete flights as needed

## Testing with Postman

### 1. Get Authentication Token
- **POST** `http://localhost:3000/api/auth/login`
- Body (JSON):
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
- Copy the `token` from the response

### 2. Test Flight CRUD Operations

**Create Flight (Admin only):**
- **POST** `http://localhost:3000/api/flights`
- Headers:
  - `Authorization: Bearer <your-token>`
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "flightNumber": "AA123",
  "airline": "American Airlines",
  "departure": "New York",
  "destination": "Los Angeles",
  "departureTime": "2024-01-15T10:00:00",
  "arrivalTime": "2024-01-15T13:00:00",
  "price": 299.99,
  "seats": 150
}
```

**Get All Flights:**
- **GET** `http://localhost:3000/api/flights`
- Headers: `Authorization: Bearer <your-token>`

**Update Flight:**
- **PUT** `http://localhost:3000/api/flights/<flightId>`
- Headers: `Authorization: Bearer <your-token>`
- Body: (same as create, with updated values)

**Delete Flight:**
- **DELETE** `http://localhost:3000/api/flights/<flightId>`
- Headers: `Authorization: Bearer <your-token>`

### 3. Test Booking Operations

**Create Booking:**
- **POST** `http://localhost:3000/api/bookings`
- Headers: `Authorization: Bearer <your-token>`
- Body (JSON):
```json
{
  "flightId": "<flight-id>",
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com",
  "passengerPhone": "1234567890",
  "numberOfSeats": 2
}
```

**Get User Bookings:**
- **GET** `http://localhost:3000/api/bookings/my-bookings`
- Headers: `Authorization: Bearer <your-token>`

**Get All Bookings (Admin):**
- **GET** `http://localhost:3000/api/bookings/all`
- Headers: `Authorization: Bearer <admin-token>`

## Important Notes

1. **DynamoDB Tables**: The tables will be created automatically when you first run the backend server. Make sure your AWS credentials are correct in the `.env` file.

2. **CORS**: The backend is configured to accept requests from the frontend. If you're testing with Postman, make sure to include the Authorization header.

3. **Token Expiry**: JWT tokens expire after 24 hours. You'll need to login again after expiry.

4. **Port Conflicts**: If port 3000 is already in use, the frontend will automatically use another port (like 3001). Make sure to update the API_URL in `frontend/src/services/api.js` if needed.

## Troubleshooting

### Backend won't start:
- Check if port 3000 is available
- Verify AWS credentials in `.env` file
- Make sure all dependencies are installed

### Frontend can't connect to backend:
- Verify backend is running on port 3000
- Check the API_URL in `frontend/src/services/api.js`
- Make sure CORS is enabled in the backend

### DynamoDB errors:
- Verify AWS credentials are correct
- Check AWS region is correct (us-east-1)
- Ensure you have DynamoDB permissions in your AWS account

## Support

For issues or questions, check the main README.md file for more detailed information.

