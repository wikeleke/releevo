# Releevo Marketplace

Releevo is a modern full-stack web application designed as a marketplace for buying and selling traditional businesses (like Acquire.com). It features role-based access control, a secure Paywall for confidential data, and a sleek user interface built with Tailwind CSS.

## Features

- **Public Marketplace:** Search and filter available businesses by city, sector, and price.
- **Role-Based Users:** 
  - `Buyer` (default): Can view public listings. Can upgrade to Premium.
  - `Seller`: Can create business listings and mark listing fees as paid.
  - `Admin`: Can publish pending businesses or mark them as sold.
- **Premium Paywall:** Confidential details (Legal Name, Exact Address, Contact Info, Website) are protected and only visible to Premium users.
- **Seller Dashboard:** Sellers can manage their listings and create new ones. Admins can view and approve all listings.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT)
- **Frontend:** React.js (Vite), Tailwind CSS, React Router, Axios, Lucide React icons
- **Styling:** Custom unified color palette (`#f9fafb` Background, `#374151` Oxford Gray, `#1e3a8a` Deep Marine Blue).

## Prerequisites

- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017` or Atlas URI)

## Installation & Setup

1. **Clone the repository** (or run from the root map):
   ```bash
   git clone <repo-url>
   cd Releevo
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   cp .env.example .env
   # Start the development server
   npm run dev
   ```
   *The backend will run on http://localhost:5000*

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   # Start the Vite development server
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Demo Walkthrough

1. Navigate to `http://localhost:5173`.
2. Go to **Sign Up** and create a user. Choose whether you want to Buy or Sell.
3. If you chose **Seller**, log in, go to your **Dashboard**, and create a new business listing. The listing will remain `pending` initially.
4. As a **Seller**, click "Pay Listing Fee" on your dashboard to simulate payment.
5. Log out and create an **Admin** user (you can temporarily change a user's role to 'admin' in MongoDB manually to test admin features, or add a backdoor endpoint).
6. As an **Admin**, go to the Dashboard and mark the pending business as `published`.
7. Log out, create a standard **Buyer** account. Browse the **Marketplace**.
8. View a business detail. You will encounter the **PaywallModal**. Click "Unlock" to simulate a Premium transaction. The confidential data will be revealed!

## Project Structure

```text
Releevo/
├── backend/
│   ├── src/
│   │   ├── config/ (Database connection)
│   │   ├── controllers/ (Logic for Auth and Business routes)
│   │   ├── middleware/ (Auth, Role check, Premium check)
│   │   ├── models/ (Mongoose schemas)
│   │   ├── routes/ (Express router definitions)
│   │   ├── app.js (Express app definition)
│   │   └── server.js (Server entry point)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/ (Header, Footer, BusinessCard, FilterSidebar, PaywallModal)
    │   ├── context/ (AuthContext for global state)
    │   ├── pages/ (Home, Login, Signup, Marketplace, BusinessDetail, Dashboard)
    │   ├── services/ (Axios instance with auto-token injection)
    │   ├── App.jsx (React Router definitions)
    │   └── main.jsx
    ├── tailwind.config.js
    └── postcss.config.js
```
