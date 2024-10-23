# Daily Expenses Sharing Application

This is a backend application built with Node.js, Express, and Prisma for managing daily expenses and user authentication. Users can create expenses, share them with others, and download balance sheets via email.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (sign up and sign in)
- Add, retrieve, and manage expenses
- Split expenses among participants
- Download balance sheets as CSV and send via email

## Technologies Used

- Node.js
- Express
- Prisma (PostgreSQL)
- JSON2CSV
- Nodemailer
- Zod (for validation)
- CORS
- dotenv

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Aadcode/Expense-Tracker.git
   cd Expense-Tracker
   ```

2. **Install dependencies:**

   Make sure you have Node.js and npm installed, then run:

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   Create a `.env` file in the root directory and add your environment variables. For example:

   ```plaintext
   PORT=3000
   DATABASE_URL=your_database_url
   SENDGRID_API_KEY=your_sendgrid_api_key
   SESSION_SECRET=your_secret
   ```

4. **Run migrations:**

   If you're using Prisma, make sure to run the migrations to set up your database:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server:**

   ```bash
   npm start
   ```

   The server will start running on the specified port (default: 3000).

## Usage

### Authentication

- **Sign Up**: POST `/user/createUser`

  Request body:

  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "mobileNumber": "1234567890",
    "password": "your_password"
  }
  ```

- **Sign In**: POST `/user/signin`

  Request body:

  ```json
  {
    "email": "johndoe@example.com",
    "password": "your_password"
  }
  ```

- **Get User Details**: POST `/user/getUserDetails` (requires authentication)

### Expense Management

- **Add Expense**: POST `/expense/addExpense` (requires authentication)

  Request body:

  ```json
  {
    "description": "Dinner",
    "totalSum": 100,
    "participants": [
      {
        "userId": 1,
        "amountOwed": 50
      },
      {
        "userId": 2,
        "amountOwed": 50
      }
    ],
    "method": "Equal",
    "userId": 1
  }
  ```

- **Get User Expenses**: GET `/expense/user/:id` (requires authentication)

- **Get All Expenses**: GET `/expense/` (requires authentication)

- **Download Balance Sheet**: GET `/expense/balance-sheet` (requires authentication)

## Endpoints

| Method | Endpoint                 | Description                                   |
| ------ | ------------------------ | --------------------------------------------- |
| POST   | `/user/createUser`       | Create a new user                             |
| POST   | `/user/signin`           | Sign in a user                                |
| POST   | `/user/getUserDetails`   | Get user details (requires auth)              |
| POST   | `/expense/addExpense`    | Add a new expense (requires auth)             |
| GET    | `/expense/user/:id`      | Retrieve expenses for a specific user         |
| GET    | `/expense/`              | Retrieve all expenses                         |
| GET    | `/expense/balance-sheet` | Download balance sheet as CSV (requires auth) |
