# Organ Donation Management System

A beginner-friendly full-stack college project to manage:
- Donor registration
- Recipient registration
- Donor-recipient matching
- Admin dashboard summary

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas

## Project Structure

```text
organ-donation-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── pages/
└── README.md
```

## Features

1. Register donor with:
   - name, age, blood group, organ, location
2. Register recipient with:
   - name, age, blood group, required organ, urgency
3. Match donor and recipient by:
   - same blood group
   - donor organ = recipient required organ
4. Admin dashboard:
   - total donors
   - total recipients
   - total matches
   - recent donor and recipient records

## Prerequisites

- Node.js installed
- MongoDB Atlas account (free)
- Database user + IP access configured in Atlas

## Backend Setup

1. Open terminal in `backend` folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create/update `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

4. Start backend:

```bash
npm run dev
```

Expected logs:
- `MongoDB connected successfully`
- `Server running on http://localhost:5000`

## Frontend Setup

No build tools required.

Option 1:
- Open `frontend/index.html` directly in browser

Option 2 (recommended):

```bash
npx serve frontend
```

Then open the local URL shown in terminal.

## API Endpoints

### Donors
- `POST /api/donors` - Create donor
- `GET /api/donors` - Get all donors

### Recipients
- `POST /api/recipients` - Create recipient
- `GET /api/recipients` - Get all recipients

### Matches
- `GET /api/matches` - Get all donor-recipient matches
- `GET /api/matches/admin-summary` - Get admin dashboard summary

## Sample Request Bodies

### Create Donor

```json
{
  "name": "Rahul Sharma",
  "age": 28,
  "bloodGroup": "O+",
  "organ": "Kidney",
  "location": "Pune"
}
```

### Create Recipient

```json
{
  "name": "Anita Verma",
  "age": 35,
  "bloodGroup": "O+",
  "requiredOrgan": "Kidney",
  "urgency": "High"
}
```

## Demo Flow

1. Start backend server
2. Open frontend home page
3. Register one donor
4. Register one recipient
5. Open admin dashboard
6. Show count updates and matching results

## Notes

- Duplicate records are blocked using both:
  - application-level checks
  - database unique indexes
- This is a learning project (not production-ready security level)
