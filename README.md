# RateStore — Full Stack Store Rating Application

A complete full-stack application built with **Express.js**, **PostgreSQL**, and **React + Tailwind CSS**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js (Node.js) |
| Database | PostgreSQL |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Auth | JWT (jsonwebtoken) |
| Password hashing | bcryptjs |
| Validation | express-validator |

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # PostgreSQL connection pool
│   │   │   └── initDb.js      # Schema creation + seed admin
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   ├── storeController.js
│   │   │   └── ownerController.js
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT authenticate + authorize
│   │   │   └── validation.js  # express-validator rules
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── stores.js
│   │   └── index.js           # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── UI.jsx         # Shared UI components
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminUsers.jsx
    │   │   │   ├── AddUser.jsx
    │   │   │   ├── UserDetail.jsx
    │   │   │   ├── AdminStores.jsx
    │   │   │   └── AddStore.jsx
    │   │   ├── user/
    │   │   │   └── UserStores.jsx
    │   │   └── owner/
    │   │       └── OwnerDashboard.jsx
    │   ├── utils/
    │   │   └── api.js         # Axios instance
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14

### 1. Clone & Setup Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE store_rating_db;"
```

### 2. Backend Setup

```bash
cd store-rating-app/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DB credentials and JWT secret

# Initialize database schema + seed admin
node src/config/initDb.js

# Start development server
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd store-rating-app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin@12345 |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |
| GET | `/me` | Authenticated |
| PUT | `/update-password` | Authenticated |

### Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Platform stats |
| POST | `/users` | Create user |
| GET | `/users` | List users (filterable) |
| GET | `/users/:id` | User detail |
| POST | `/stores` | Create store |
| GET | `/stores` | List stores (filterable) |

### Stores (`/api/stores`)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/` | Normal User |
| POST | `/:storeId/rate` | Normal User |
| GET | `/owner/dashboard` | Store Owner |

---

## Form Validation Rules

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, 1 uppercase, 1 special character |
| Email | Standard email format |
| Rating | Integer 1–5 |

---

## Features

### System Administrator
- Dashboard with total users, stores, ratings counts
- Add users (admin / user / store_owner roles)
- Add stores with optional owner assignment
- Filter users/stores by name, email, address, role
- Sortable tables (ascending/descending)
- View user detail (includes store rating for store owners)

### Normal User
- Self-registration and login
- Browse all registered stores
- Search stores by name and address
- Submit ratings (1–5 stars) for any store
- Modify previously submitted ratings
- Change password from profile page

### Store Owner
- Login and view own store dashboard
- See average rating and total count
- View list of customers who rated their store
- Change password from profile page

---

## Database Schema

```sql
-- Roles ENUM
CREATE TYPE user_role AS ENUM ('admin', 'user', 'store_owner');

-- Users
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(60) CHECK (char_length(name) >= 20),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  address     VARCHAR(400),
  role        user_role DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Stores
CREATE TABLE stores (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(60) CHECK (char_length(name) >= 20),
  email       VARCHAR(255) UNIQUE NOT NULL,
  address     VARCHAR(400),
  owner_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Ratings (unique per user+store pair)
CREATE TABLE ratings (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id    INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);
```

---

## Security Features
- JWT-based stateless authentication
- Bcrypt password hashing (cost factor 12)
- Role-based access control on all protected routes
- Rate limiting (100 req / 15 min per IP)
- Input validation and sanitization on all endpoints
- SQL injection prevention via parameterized queries
- CORS configured for frontend origin only
