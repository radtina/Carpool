# Carpool App 🚗

A full-stack web application that allows users to **post rides**, **find rides**, and soon—**message each other**. Built with Go (Golang) for the backend and React for the frontend.

---

## 🔧 Tech Stack

- **Frontend**: React.js  
- **Backend**: Go (Golang)  
- **Database**: PostgreSQL  
- **Authentication**: JWT  
- **Hosting**: Render / Local

---

## ✨ Features

- **User Registration & Login**
- **Secure JWT-based Authentication**
- **Post a Ride** (origin, destination, date, available seats, etc.)
- **Find a Ride** (search filters by location and time)
- **API with CORS and TLS support**
- **Structured Go backend with clean project layout**
- **(Upcoming)** Real-time or direct messaging between users

---

## 📁 Project Structure

### Backend (`/backend`)
cmd/
  carpool-backend/          # Main entry point
config/                     # Configuration files
controllers/                # API request handlers
models/                     # Database models and logic
routes/                     # Route definitions
utils/                      # Helper functions
middleware/                 # Auth, logging, error handling

### Frontend (`/frontend`)
src/
  components/
  pages/
  api/
  App.jsx
  main.jsx

---

## 🛠️ Running Locally

### Backend (Go)

1. Clone the repo  
2. Set up your PostgreSQL DB and `.env` file (see below)  
3. Navigate to `/backend`  
4. Run the server:

```bash
go run cmd/carpool-backend/main.go
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 .env Example (Backend)

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=carpool
JWT_SECRET=your_jwt_secret

---

## 📦 API Endpoints (Sample)

- `POST /register` – Register a new user  
- `POST /login` – Authenticate a user and return JWT  
- `POST /rides` – Post a new ride  
- `GET /rides` – Get all available rides  
- `GET /rides/:id` – Get ride by ID

---

## 🚀 Upcoming Features

- Messaging between users  
- Ride request and confirmation system  
- User reviews and ratings  
- Ride history and analytics dashboard  

---

## 🙋‍♀️ Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change. This project is in active development 🚧

---

## 📜 License

[MIT](LICENSE)

---

## 💬 Connect

Built with ❤️ by [Tina Radvar](https://github.com/radtina)
