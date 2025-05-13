# Weave Haven

Premium fabrics, delivered online.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/weave-haven/actions)
[![Coverage](https://img.shields.io/badge/coverage-90%25-blue)](https://github.com/yourusername/weave-haven/coverage)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A full-stack e-commerce platform offering premium fabrics with a customer-facing storefront and an admin dashboard for managing products, orders, and users.

---

## 📦 Tech Stack

* **Frontend**

  * React 18, React Router v6
  * Context API for authentication, cart, and wishlist
  * Axios with HTTP-only cookies for secure auth
  * Tailwind CSS & CSS Modules
  * Chart.js for analytics in the admin console

* **Backend**

  * Node.js & Express
  * MongoDB & Mongoose
  * JWT (access + refresh tokens) via secure, HTTP-only cookies
  * bcrypt for password hashing
  * Nodemailer for transactional emails
  * Multer & Sharp for image upload and processing

* **Dev & Ops**

  * dotenv for environment variables
  * Jest for testing
  * Helmet & rate-limiting middleware for security
  * JSDoc & Postman collection (available at `/docs`)
  * Sentry (or similar) for error monitoring
  * Automated daily backups

---

## 📁 Repository Structure

```
weave-haven/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling, security
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # Email, image, token helpers
│   │   └── index.js        # Server entrypoint
│   ├── .env                # Environment variables
│   └── package.json
└── frontend/
    ├── public/             # Static assets (HTML, favicon)
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React Context providers
    │   ├── pages/          # Route-specific pages
    │   ├── styles/         # Tailwind & CSS Modules
    │   ├── utils/          # axios instance, helpers
    │   └── App.jsx         # Router setup
    ├── .env                # (optional React env vars)
    └── package.json
```

---

## ⚙️ Environment Configuration

Create a `backend/.env` file with the following variables:

```ini
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/weave-haven

# JSON Web Tokens\JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
SMTP_FROM="Weave Haven <your_email@gmail.com>"
```

> **Note:** In production, set these in your host environment or secrets manager.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/weave-haven.git
cd weave-haven
```

### 2. Backend

```bash
cd backend
npm install
npm run dev      # development (nodemon)
npm start        # production
npm test         # run tests
```

Server will be available at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm start        # development
npm run build    # production build
```

App runs at `http://localhost:3000` (proxy to `/api` → port 5000).

---

## 🔑 Authentication Flow

1. **Register** → receive email verification link (expires in 24h)
2. **Verify email** → account becomes active
3. **Login** → receive JWT in HTTP-only cookie
4. **Access protected routes** (profile, orders, admin)
5. **Logout** → clear cookie & revoke refresh token

---

## 📬 Key API Endpoints

| Method | Endpoint                         | Description                        |
| ------ | -------------------------------- | ---------------------------------- |
| POST   | `/api/auth/register`             | Register & send verification email |
| GET    | `/api/auth/confirm-email/:token` | Confirm email                      |
| POST   | `/api/auth/login`                | Login & set JWT cookie             |
| POST   | `/api/auth/logout`               | Clear auth cookie                  |
| GET    | `/api/auth/profile`              | Get current user (protected)       |
| PUT    | `/api/auth/profile`              | Update user profile (protected)    |
| POST   | `/api/products`                  | Create new product (admin only)    |
| GET    | `/api/products`                  | List & filter products             |
| POST   | `/api/orders`                    | Create order & send confirmation   |
| GET    | `/api/orders`                    | Get user order history             |
| PUT    | `/api/orders/:id/status`         | Update order status (admin only)   |

> For full request/response examples, see the Postman collection in `/docs`.

---

## 🚢 Deployment

1. Build frontend:

   ```bash
   cd frontend
   npm run build
   ```
2. Serve `frontend/build` statically from Express (production mode).
3. Configure environment variables in your host (e.g., Heroku, Vercel, AWS).
4. Use HTTPS with HSTS, set up CDN for images, and schedule daily backups.

*Example (Docker Compose)*:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    env_file: ./backend/.env
    ports:
      - "5000:5000"
  frontend:
    build: ./frontend
    env_file: ./frontend/.env
    ports:
      - "3000:3000"
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

* Code style and linting rules
* Branch naming conventions
* Pull request process

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a pull request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by the Weave Haven team
