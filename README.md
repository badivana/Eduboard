DEMO: https://eduboard-git-main-badivanas-projects.vercel.app
# 🎓 EduBoard — Full-Stack MERN Learning Platform

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

EduBoard is a modern, production-style **e-learning platform** built with the **MERN stack**
(MongoDB, Express, React, Node.js). It started life as a static HTML site and has been rebuilt
into a full application with authentication, a course catalog, enrollments, reviews, and a
student dashboard.

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Web app** (Vercel) | <https://eduboard-git-main-badivanas-projects.vercel.app> |
| **API** (Render) | <https://eduboard-nbb0.onrender.com/api/health> |

> ⏳ The API runs on Render's free tier and sleeps after ~15 min idle, so the **first**
> request may take ~30s to wake. Subsequent requests are fast.

**Try it** — log in with a seeded demo account:

| Role | Email | Password |
|------|-------|----------|
| Student | `student@eduboard.com` | `password123` |
| Admin | `admin@eduboard.com` | `admin123` |

---

## ✨ Features

### Frontend (React + Vite + Tailwind)
- 🎨 Attractive, fully responsive UI with the EduBoard brand
- 🏠 Landing page with hero, features, featured courses & CTA
- 📚 Course catalog with **search, category filters, sorting & pagination**
- 📖 Rich course detail page — curriculum, instructor, reviews, enroll flow
- 🔐 Register / login with JWT (httpOnly cookie + bearer token)
- 📊 Student dashboard — enrolled courses, progress tracking, profile editing
- 💰 Dynamic pricing page & contact form
- 🔔 Toast notifications, protected routes, loading states

### Backend (Node + Express + MongoDB)
- 🔑 **JWT authentication** with `student` / `instructor` / `admin` roles
- 🧱 RESTful API for courses, enrollments, reviews, plans, contact & users
- 🛡️ Security hardening: `helmet`, CORS, rate limiting, `express-mongo-sanitize`, bcrypt
- ✅ Request validation with `express-validator`
- 🗄️ Mongoose models with relations, virtuals, text search & auto-rating aggregation
- ⚠️ Centralized error handling & async wrappers
- 🌱 Seed script with demo users, courses, reviews & plans

---

## 🧱 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Axios, React Hot Toast |
| Backend   | Node.js, Express, Mongoose, JWT, bcryptjs, express-validator |
| Database  | MongoDB |

---

## 📂 Project Structure

```text
Eduboard/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Navbar, Footer, CourseCard, ...
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Home, Courses, CourseDetail, Dashboard, ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                  # Express + MongoDB backend
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # auth, error, validation
│   │   ├── models/          # User, Course, Enrollment, Review, Plan, Contact
│   │   ├── routes/          # API routes
│   │   ├── utils/           # token, seed
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
│
└── package.json             # Root scripts to run both apps
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 1. Clone & install

```bash
git clone https://github.com/badivana/Eduboard.git
cd Eduboard
npm run install:all      # installs both server and client deps
```

### 2. Configure environment

```bash
# Backend
cp server/.env.example server/.env
# then edit server/.env — set MONGO_URI and a strong JWT_SECRET
```

The frontend needs no env in development (Vite proxies `/api` to the backend).

### 3. Seed the database (optional but recommended)

```bash
npm run seed
```

This creates demo accounts:

| Role       | Email                  | Password     |
|------------|------------------------|--------------|
| Admin      | admin@eduboard.com     | admin123     |
| Instructor | sarah@eduboard.com     | password123  |
| Student    | student@eduboard.com   | password123  |

### 4. Run the app (two terminals)

```bash
npm run dev:server      # → http://localhost:5000  (API)
npm run dev:client      # → http://localhost:5173  (web app)
```

Open **http://localhost:5173**.

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint                      | Description                  | Access      |
|--------|-------------------------------|------------------------------|-------------|
| POST   | `/auth/register`              | Create account               | Public      |
| POST   | `/auth/login`                 | Log in                       | Public      |
| GET    | `/auth/me`                    | Current user                 | Auth        |
| GET    | `/courses`                    | List/search/filter courses   | Public      |
| GET    | `/courses/:slug`              | Course detail + reviews      | Public      |
| POST   | `/courses`                    | Create course                | Instructor  |
| POST   | `/enrollments`                | Enroll in a course           | Auth        |
| GET    | `/enrollments/me`             | My enrollments               | Auth        |
| PATCH  | `/enrollments/:id/progress`   | Update progress              | Auth        |
| POST   | `/reviews`                    | Add/update a review          | Enrolled    |
| GET    | `/plans`                      | Pricing plans                | Public      |
| POST   | `/contact`                    | Submit contact form          | Public      |

---

## 🛠️ Root Scripts

| Script                | Action                                 |
|-----------------------|----------------------------------------|
| `npm run install:all` | Install server + client dependencies   |
| `npm run seed`        | Seed MongoDB with demo data            |
| `npm run dev:server`  | Start the API in watch mode            |
| `npm run dev:client`  | Start the Vite dev server              |
| `npm run build`       | Build the frontend for production      |
| `npm start`           | Start the production API server        |

---

## ☁️ Deployment

EduBoard is deployed as three separate services:

```text
Browser ──> Vercel (React SPA) ──HTTPS /api──> Render (Express API) ──> MongoDB Atlas
```

| Piece | Host | Notes |
|-------|------|-------|
| Frontend | **Vercel** | Root dir `client`; needs `VITE_API_URL` = the Render API base URL (no trailing slash, no `/api`) |
| Backend | **Render** | Root dir `server`; needs `MONGO_URI`, `CLIENT_URL`, `JWT_SECRET`, `NODE_ENV=production` |
| Database | **MongoDB Atlas** | Network Access must allow `0.0.0.0/0` (Render uses dynamic IPs) |

📖 **Full step-by-step guide:** see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Two gotchas worth knowing
- **CORS** — the API only answers browsers from allowed origins. `app.js` accepts anything in
  `CLIENT_URL` (comma-separated) **plus** this project's Vercel deployment URLs
  (`*-badivanas-projects.vercel.app`), so preview deploys work without reconfiguring.
- **Local DB ≠ cloud DB** — your local MongoDB and Atlas are separate. Production starts empty.
  Seed Atlas **once** by pointing the seed script at it:
  ```bash
  cd server
  # PowerShell:
  $env:MONGO_URI="<your atlas uri>"; npm run seed; Remove-Item Env:MONGO_URI
  # bash:
  MONGO_URI="<your atlas uri>" npm run seed
  ```
  ⚠️ The seed **wipes all collections first** — only run it on an empty/throwaway database,
  never after real users sign up.

---

## 📄 License

MIT — feel free to use, modify, and distribute for educational purposes.

## 👨‍💻 Author

**Prajwal B T** — [github.com/badivana](https://github.com/badivana)
