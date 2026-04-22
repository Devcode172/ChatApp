# Talk Nest 🐦

A modern, real-time Progressive Web Application (PWA) built for seamless communication. Talk Nest allows users to engage in instant messaging, view online statuses, track unread messages, and receive background push notifications even when the app is closed.

## 🚀 Features

- **Real-Time Messaging:** Instant message delivery and read receipts powered by Socket.io.
- **Progressive Web App (PWA):** Fully installable on iOS and Android devices directly from the browser (bypassing the App Store / Play Store).
- **Background Push Notifications:** Stay updated with native mobile push notifications even when the browser is completely closed (powered by Web Push & Service Workers).
- **Online/Offline Status:** See which of your contacts are currently online in real-time.
- **Unread Message Tracking:** Persistent badge counters for unread messages.
- **Responsive Modern UI:** Built with Tailwind CSS v4 and DaisyUI for a beautiful, mobile-first experience.
- **Secure Authentication:** JWT-based authentication with Bcrypt password hashing.

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React 19 & Vite
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS v4 & DaisyUI
- **Real-time:** Socket.io-client
- **Routing:** React Router DOM
- **Other:** Axios, React Hot Toast

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (`pg`)
- **Real-time:** Socket.io
- **Push Notifications:** `web-push`
- **Security:** JSON Web Tokens (JWT), Bcrypt, Cookie-Parser, CORS

## 📦 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/talk-nest.git
cd talk-nest
```

### 2. Setup the Backend
Navigate to the server directory, install dependencies, and setup your `.env` file:
```bash
cd server
npm install
```

Create a `server/.env` file with the following variables:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=2d
COOKIE_EXPIRES=2
CLIENT_URL=http://localhost:5173

# Run `npx web-push generate-vapid-keys` to get these:
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your@email.com

# Optional (if not using local default postgres):
# DATABASE_URL=postgres://user:pass@host/dbname
```

### 3. Setup the Frontend
Navigate to the client directory, install dependencies, and setup your `.env` file:
```bash
cd ../client
npm install
```

Create a `client/.env` file:
```env
VITE_URL=http://localhost:3000/api/v4
VITE_SOCKET_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_from_backend
```

### 4. Run the Application
You need to run both the frontend and backend servers simultaneously.

**Run Backend:**
```bash
cd server
npm start
```

**Run Frontend:**
```bash
cd client
npm run dev
```

Your app should now be running at `http://localhost:5173`.

## 🌐 Deployment
- **Frontend:** Deployed to Vercel. Ensure all `VITE_` variables are added to Vercel's Environment Variables.
- **Backend:** Deployed to Render. Ensure all backend `.env` variables are added to Render's Environment Variables.
- **Database:** Hosted on Neon / Supabase / Render PostgreSQL.

## 🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a pull request.
