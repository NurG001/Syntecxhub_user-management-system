<!-- HERO IMAGE -->
<p align="center">
  <img src="https://raw.githubusercontent.com/NurG001/mine/refs/heads/main/project%20img/user-management./header.png" alt="StaffSync Dashboard" width="100%" />
</p>

<h1 align="center">StaffSync | Multi-User Management System</h1>

<p align="center">
  A professional-grade MERN Stack user management system with secure multi-user architecture.
</p>

---

## 📌 Overview

**StaffSync** is a professional-grade **User Management System** built using the **MERN Stack**.  
Developed to fulfill the requirements of **Project – 1**, it features a robust RESTful API, secure **JWT-based authentication**, and a fully responsive dashboard designed for **organization-level team management**.

---

## 📸 Visual Showcase

| Feature | Desktop View | Mobile View |
|------|-------------|------------|
| **Main Dashboard** | <img src="https://raw.githubusercontent.com/NurG001/mine/refs/heads/main/project%20img/user-management./dashboard.png" width="100%"/> | <img src="https://raw.githubusercontent.com/NurG001/mine/refs/heads/main/project%20img/user-management./mbl_dashboard.png" width="100%"/> |
| **Authentication System** | <img src="https://raw.githubusercontent.com/NurG001/mine/refs/heads/main/project%20img/user-management./login.png" width="100%"/> | <img src="https://raw.githubusercontent.com/NurG001/mine/refs/heads/main/project%20img/user-management./reg.png" width="100%"/> |
| **User Management** | <img src="https://github.com/NurG001/mine/blob/main/project%20img/user-management./user%20manage.png" width="100%"/> | <img src="https://raw.githubusercontent.com/NurG001/mine/refs/heads/main/project%20img/user-management./user_manage_mbl.png" width="100%"/> |

---

## 🚀 Key Features

- **RESTful API & CRUD** – Full Create, Read, Update, and Delete operations
- **Multi-Tenant Architecture** – Strict data isolation per organization
- **JWT Authentication** – Secure token-based session handling
- **Admin Profile Management** – Update name, email & password (bcryptjs)
- **Responsive UI/UX** – Mobile sidebar, search & smooth transitions
- **Live Notifications** – `react-hot-toast` for real-time feedback
- **Custom Logout Flow** – Confirmation modal to prevent accidental exits

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Lucide React  
- React Hot Toast  

### Backend
- Node.js  
- Express.js  

### Database & Security
- MongoDB + Mongoose  
- JWT Authentication  
- BcryptJS Password Hashing  

---

## 📂 Project Structure

```text
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, UserCards, Auth
│   │   ├── api.js         # Axios configuration
│   │   └── App.jsx        # State & routing logic
├── server/                # Node.js Backend
│   ├── controllers/       # Business logic (multi-tenant)
│   ├── models/            # User & Organization schemas
│   └── routes/            # Protected API routes
└── .env                   # Environment variables
````

---

## 🚥 API Endpoints

### Authentication

| Method | Endpoint              | Description                       |
| ------ | --------------------- | --------------------------------- |
| `POST` | `/api/users/register` | Register new organization & admin |
| `POST` | `/api/users/login`    | Authenticate admin and return JWT |

### User Management (Protected)

| Method   | Endpoint             | Description                   |
| -------- | -------------------- | ----------------------------- |
| `GET`    | `/api/users/`        | Get all users in organization |
| `POST`   | `/api/users/`        | Add new team member           |
| `PUT`    | `/api/users/:id`     | Update user details           |
| `DELETE` | `/api/users/:id`     | Remove user                   |
| `PUT`    | `/api/users/profile` | Update admin profile          |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/NurG001/Syntecxhub_user-management-system
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Start server:

```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 👨‍💻 Author

**Ismail Mahmud Nur**
*Software Engineer | East West University Graduate*

📧 **Contact:** GitHub / LinkedIn via profile
⭐ If you like this project, consider giving it a star!

```
