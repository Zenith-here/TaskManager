# Task Manager

A sleek and modern **Task Management Web App** built with **React (Frontend)** and **Node.js + Express (Backend)**.  
It allows users to **create, edit, complete, and track tasks** with a clean, dark-themed UI.

---

## Features

- **User Authentication** (Login & Signup)
- **Task Creation and Editing**
- **Mark Tasks as Completed or Pending**
- **Task Prioritization (Low, Medium, High)**
- **Filter & Sort Tasks** (Newest, Oldest, Priority)
- **Dark Mode with Modern Gradient Styling**
- **Responsive Design** (works on desktop and mobile)

---

## Tech Stack

### Frontend:

- React (with React Router for navigation)
- Tailwind CSS for styling
- Lucide React Icons
- Axios for API requests

### Backend:

- Node.js + Express
- MongoDB (for storing tasks and user data)
- JWT Authentication

---

## Installation & Setup

# **Clone the repository**

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

# Install dependencies

cd frontend
npm install
cd ../backend
npm install

# Set up environment variables

# Create a .env file in the backend/ directory with the following:

# (Copy this into backend/.env)

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000

# Run the app

# In one terminal, start the backend:

cd backend
npm start

# In another terminal, start the frontend:

cd frontend
npm run dev

# Open the app in your browser:
