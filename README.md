# Hamba Village Union App

A web application for managing a village union's deposits, members, and cow purchases. Built with Next.js, Express.js, MongoDB, and TailwindCSS.

## Features

- **Member Management:** Add, edit, and track village union members
- **Deposit Tracking:** Record and monitor member deposits
- **Cow Purchase Management:** Track cow purchases and participating members
- **Public Dashboard:** View key statistics and information
- **Admin Dashboard:** Manage all aspects of the village union
- **PDF Reports:** Generate and download PDF reports of members and their deposits

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TailwindCSS 4, React 19
- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Mongoose
- **PDF Generation:** @react-pdf/renderer
- **File Upload:** express-fileupload

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas connection)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hamba.git
   cd hamba
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/hamba
   PORT=5000
   NODE_ENV=development
   ```

## Running the Application

To run both frontend and backend concurrently:

```
npm run dev:all
```

Or run them separately:

Frontend:
```
npm run dev
```

Backend:
```
npm run dev:server
```

## Project Structure

```
/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── MembersList.tsx    # Public view of members
│   │   ├── Stats.tsx          # Statistics display
│   │   └── ...
│   └── server/                # Express.js backend
│       ├── models/            # Mongoose models
│       │   ├── Member.js
│       │   ├── Deposit.js
│       │   └── CowPurchase.js
│       ├── routes/            # API routes
│       │   ├── members.js
│       │   ├── deposits.js
│       │   └── cowPurchases.js
│       └── server.js          # Express server setup
├── public/                    # Static files
│   └── uploads/               # Upload directory for receipts
└── ...
```

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get a specific member
- `POST /api/members` - Add a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Deposits
- `GET /api/deposits` - Get all deposits
- `GET /api/deposits/:id` - Get a specific deposit
- `POST /api/deposits` - Add a new deposit
- `PUT /api/deposits/:id` - Update a deposit
- `DELETE /api/deposits/:id` - Delete a deposit

### Cow Purchases
- `GET /api/cow-purchases` - Get all cow purchases
- `GET /api/cow-purchases/:id` - Get a specific cow purchase
- `POST /api/cow-purchases` - Add a new cow purchase
- `PUT /api/cow-purchases/:id` - Update a cow purchase
- `DELETE /api/cow-purchases/:id` - Delete a cow purchase

## License

MIT

## Author

Your Name
# goru-club
