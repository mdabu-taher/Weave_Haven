# Weave Haven

Premium fabrics, delivered online.


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
# MongoDB connection
MONGO_URI=mongodb+srv://weave_haven:Weave_Haven11@taherdb.5kz8id0.mongodb.net/?retryWrites=true&w=majority&appName=taherDB

# JSON Web Token settings (if used)
JWT_SECRET=someVerySecretKey
JWT_EXPIRES_IN=1d

# Frontend URL for links in emails

FRONTEND_URL=https://weave-haven-m4qd.vercel.app
REACT_APP_API_BASE_URL=https://weave-haven-backend.onrender.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tawsiftaher@gmail.com
SMTP_PASS=nwkqxmxwprzjskyi
SMTP_FROM="Weave Haven <tawsiftaher@gmail.com>"

```


## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mdabu-taher/Weave_Haven.git
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

Server will be available at `(https://weave-haven-backend.onrender.com)`.

### 3. Frontend

```bash
cd frontend
npm install
npm start        # development
npm run build    # production build
```

App runs at https://weave-haven-m4qd.vercel.app` .

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



---

Deployment
1. Frontend Deployment (Vercel)

Go to Vercel.
Connect your GitHub repository.
Add the corresponding variables according to given above.

2. Backend Deployment (Render)

Go to Render.
Create a new Web Service:
Root directory: backend
Start command: npm start
Add the corresponding environment variables:

Enable static file hosting:

uploads/ folder must be served via:
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

Production Tips

Enable HTTPS (Render & Vercel use HTTPS by default).
Use .env.production files locally for production testing.
Schedule backups via MongoDB Atlas or your DB provider.

🤝 Contributing


We welcome contributions to Weave Haven!

Guidelines

Fork this repository.

Create a feature branch:
git checkout -b feat/your-feature

Commit your changes:
git commit -m "feat: add your feature"

Push your branch:
git push origin feat/your-feature

Open a pull request and describe what you’ve done.

Code style & Linting:

Use consistent formatting with ESLint + Prettier (if enabled).

Keep backend and frontend logic modular and documented.



## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by the Weave Haven team
