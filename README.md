# StaffSync | Multi-Tenant User Management System

**StaffSync** is a professional-grade User Management System built using the **MERN Stack**. Developed to fulfill the requirements of "Project - 1," it features a robust RESTful API, secure JWT-based authentication, and a fully responsive dashboard designed for organization-level team management.

---

## 📸 Visual Showcase

| Feature | Desktop View | Mobile View |
| --- | --- | --- |
| **Main Dashboard** |  |  |
| **Auth System** |  |  |
| **User Management** |  |  |
| **Feedback System** |  |  |

---

## 🚀 Key Features

* **RESTful API & CRUD**: Fully implemented Create, Read, Update, and Delete operations for user management.
* **Multi-Tenant Architecture**: Strict data isolation ensuring administrators only access and manage users within their specific organization.
* **Secure Authentication**: Modern JWT (JSON Web Tokens) implementation for secure session management, exceeding original requirements.
* **Professional Admin Profile**: Editable admin settings allowing updates to names, emails, and secure password hashing using `bcryptjs`.
* **Responsive UI/UX**: A modern dashboard featuring a sliding mobile sidebar, search functionality, and real-time UI updates.
* **Dynamic Notifications**: Integrated `react-hot-toast` for non-blocking visual feedback on all system actions.
* **Custom Logout Flow**: A stylized, user-friendly confirmation modal to prevent accidental session termination.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), React Hot Toast.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB & Mongoose (Schema Definition).
* **Security**: JWT for Auth, BcryptJS for password encryption.

---

## 📂 Project Structure

```text
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, UserCards, Login, Register
│   │   ├── api.js         # Centralized Axios configuration
│   │   └── App.jsx        # Main View logic & State management
├── server/                # Node.js Backend
│   ├── controllers/       # Multi-tenant business logic
│   ├── models/            # Mongoose Schemas (User & Organization)
│   └── routes/            # Protected API Endpoints
└── .env                   # JWT Secrets & MongoDB URI

```

---

## 🚥 API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/users/register` | Register a new organization and admin |
| `POST` | `/api/users/login` | Authenticate and retrieve JWT token |

### User Management (Protected)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users/` | Get all users within the specific organization |
| `POST` | `/api/users/` | Add a new team member to the organization |
| `PUT` | `/api/users/:id` | Update specific user details |
| `DELETE` | `/api/users/:id` | Remove user from the organization |
| `PUT` | `/api/users/profile` | Update Admin profile and security settings |

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/NurG001/Syntecxhub_user-management-system

```


2. **Setup Backend**:
* Navigate to `server`, run `npm install`.
* Add your `MONGO_URI` and `JWT_SECRET` to the `.env` file.
* Start server: `npm start`.


3. **Setup Frontend**:
* Navigate to `client`, run `npm install`.
* Configure `VITE_API_URL` in the `.env` file.
* Start frontend: `npm run dev`.



---

**Developed by Ismail Mahmud Nur**
*Software Engineer | East West University Graduate*
