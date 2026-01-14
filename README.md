# StaffSync | Multi-Tenant User Management System

**StaffSync** is a professional-grade User Management System built using the **MERN Stack**. Developed to fulfill the requirements of "Project - 1," it features a robust RESTful API, secure JWT-based authentication, and a fully responsive dashboard designed for organization-level team management.

## 🚀 Key Features

* **RESTful API & CRUD**: Fully implemented Create, Read, Update, and Delete operations for user management.
* **Multi-Tenant Architecture**: Innovative data isolation where administrators only manage users within their specific organization.
* **Secure Authentication**: Implemented modern industry-standard JWT (JSON Web Tokens) for secure session management, exceeding the original "Basic Auth" requirement.
* **Professional Admin Profile**: Editable admin settings allowing updates to names, emails, and secure password hashing using `bcryptjs`.
* **Responsive UI/UX**: A modern dashboard featuring a sliding mobile sidebar, search functionality, and interactive navigation.
* **Dynamic Notifications**: Integrated `react-hot-toast` to provide non-blocking visual feedback for all system actions.
* **Custom Logout Flow**: A stylized confirmation modal to ensure graceful session termination.

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), React Hot Toast.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB & Mongoose (Schema Definition).
* **Security**: JWT for Auth, BcryptJS for password encryption.

## 📂 Project Structure

```text
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, UserCards
│   │   └── App.jsx        # View logic & State management
├── server/                # Node.js Backend
│   ├── controllers/       # Business logic (User & Admin)
│   ├── models/            # Mongoose Schemas
│   └── routes/            # API Endpoints
└── .env                   # Environment Variables (JWT Secret, MongoDB URI)

```

## 🚥 API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/users/register` | Register a new organization/admin |
| `POST` | `/api/users/login` | Authenticate and get JWT token |

### User Management (Protected)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users/` | Get all users in organization |
| `POST` | `/api/users/` | Add a new team member |
| `PUT` | `/api/users/:id` | Update user details |
| `DELETE` | `/api/users/:id` | Remove user from organization |
| `PUT` | `/api/users/profile` | Update Admin profile/password |

## ⚙️ Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/staffsync.git

```


2. **Setup Backend**:
* Navigate to `server`, run `npm install`.
* Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
* Start server: `npm run dev`.


3. **Setup Frontend**:
* Navigate to `client`, run `npm install`.
* Start frontend: `npm run dev`.



---

**Developed by Ismail Mahmud Nur**
*Software Engineer | East West University Graduate*
