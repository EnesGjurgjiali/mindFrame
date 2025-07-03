# 🧠 mindFrame – Personal Productivity Planner

A clean, modular, and modern **personal productivity web app** built with **Vue 3 (Composition API)**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB Atlas**. mindFrame helps you efficiently manage your time, track your daily mood, plan across day/week/month views, and track your expenses — all with secure authentication and per-user data.

---

## ✨ Features

### ✅ Task Manager

- Add, edit, delete, and reorder tasks
- Color-coded by type (Work, Rest, Study, Personal, Prayer, etc.)
- Tasks include start and end times

### 📅 Calendar Views

- Switch between **Day**, **Week**, and **Month** views
- Click on any date to view or manage tasks

### 🌤️ Mood / Rating Tracker

- Assign a daily mood (1-5 stars or emoji)
- Visual feedback shown on the calendar

### 💸 Expense Tracker

- Log daily expenses with amount, description, and category
- Set and track daily & monthly budgets
- See total spent and remaining for today and this month
- Edit/delete expenses
- Smooth, collapsible UI that blends with the app

### 🕘 Timeline View

- Horizontal visual timeline of tasks for a selected day

### 🔄 Drag & Drop Support

- Rearrange tasks within the same day
- Easily change time slots with intuitive drag-and-drop

### 🔒 Authentication

- Register/login with secure JWT authentication

### 📱 Responsive Design

- Mobile and desktop friendly
- Built with Tailwind CSS for a clean, modern UI/UX

### 💬 UI/UX Enhancements

- Toast notifications for actions (add/edit/delete, login/logout)
- Heroicons for visual clarity

---

## 🗂️ Project Structure

```
mindFrame_Project/
  mindFrame_frontend/   # Vue 3 + Vite frontend
  mindFrame_backend/    # Node.js + Express backend
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd mindFrame_Project
```

### 2. Setup the Backend

```sh
cd mindFrame_backend
npm install
# Create a .env file with your MongoDB Atlas URI and JWT secret
cp .env.example .env  # (if you have an example file)
# Edit .env and set MONGODB_URI and JWT_SECRET
npm run dev           # Start backend (nodemon)
```

### 3. Setup the Frontend

```sh
cd ../mindFrame_frontend
npm install
npm run dev           # Start frontend (Vite)
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Environment Variables

### Backend (`mindFrame_backend/.env`):

```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## 📦 Build for Production

### Frontend

```sh
cd mindFrame_frontend
npm run build
```

The output will be in the `dist/` folder.

### Backend

Deploy as a standard Node.js Express app (see your hosting provider's docs).

---

## 📄 License

MIT

---

Made with 💻 by Enes Gjurgjiali
