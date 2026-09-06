# Student Task & Study Planner

A full-stack **MERN web application** designed to help students organize academic tasks, subjects, study sessions, exams, deadlines, and progress through a single productivity platform.

The application combines academic planning, task management, study scheduling, focus timing, examination tracking, calendar visualization, deadline notifications, and progress monitoring in one centralized system.

---

## Overview

Students often manage assignments, study plans, examinations, and deadlines across multiple applications or notes. This project provides a unified workspace for planning and tracking academic activities.

The application allows authenticated users to:

- Organize academic subjects
- Create and manage tasks and assignments
- Prioritize work and track deadlines
- Monitor subject-wise task completion
- Plan study sessions
- Use a focus/Pomodoro timer
- Manage upcoming examinations
- View tasks and exams together in a calendar
- Receive deadline-oriented notifications
- Monitor academic activity and progress from the dashboard
- Switch between light and dark themes

---

## Core Features

### Authentication & Profile

- User registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Public-only authentication routes
- Secure logout
- User profile management
- Password visibility controls
- User-specific data access

### Subject Management

- Create, update, and delete subjects
- Assign difficulty levels
- Customize subject colors
- View subject-wise task progress
- Display task completion percentage from 0–100%

### Task & Assignment Management

- Create, update, and delete tasks
- Associate tasks with subjects
- Set task priority
- Set deadlines
- Mark tasks as completed
- Track pending and completed work
- Identify overdue tasks

### Study Sessions

- Create and manage study sessions
- Plan dedicated study time
- Track planned study activities
- Organize study sessions as part of the academic workflow

### Focus Timer

- Pomodoro-style focus timer
- Focus and break intervals
- Dedicated interface for focused study periods

### Exam Management

- Create, update, and delete exams
- Set examination dates
- Organize upcoming examinations
- Display exams within the academic calendar

### Calendar

- Unified calendar for academic activities
- Display tasks and exams together
- View upcoming deadlines
- Centralize important academic dates

### Notifications

- Deadline-oriented notifications
- Unread notification count
- Mark notifications as read
- Delete notifications
- Notifications ordered by deadline, with the earliest deadline shown first

### Dashboard & Progress

- Centralized academic overview
- Task completion information
- Subject-related progress
- Upcoming deadlines
- Study planning information
- Progress-focused dashboard

### User Interface

- Responsive React-based interface
- Light and dark themes
- Consistent navigation and layout
- Password show/hide controls
- Clean, productivity-focused user experience

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, Tailwind CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose, MongoDB Atlas |
| Authentication | JWT, password hashing |
| Configuration | dotenv, environment variables |
| Version Control | Git, GitHub |
| Deployment | Render |

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │        Student       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend API     │
                    └──────────┬───────────┘
                               │
                     Mongoose / Data Access
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │       Database       │
                    └──────────────────────┘
```

---

## Application Workflow

```text
Register / Login
       │
       ▼
Authenticated User
       │
       ├── Subjects
       │      └── Subject-wise Progress
       │
       ├── Tasks
       │      └── Priorities, Deadlines & Completion
       │
       ├── Study Sessions
       │
       ├── Focus Timer
       │
       ├── Exams
       │
       ├── Calendar
       │      └── Tasks + Exams
       │
       ├── Notifications
       │      └── Upcoming Deadlines
       │
       └── Dashboard
              └── Academic Overview & Progress
```

---

## Authentication & Authorization

The application uses token-based authentication to protect user-specific resources.

1. A user creates an account through registration.
2. The password is securely hashed before being stored.
3. The user authenticates through the login endpoint.
4. The backend issues a JWT for the authenticated session.
5. The frontend uses the authenticated session for protected requests.
6. Axios attaches the authentication token to protected API requests.
7. Backend authentication middleware validates the token.
8. Database queries are scoped to the authenticated user.

This ensures that academic data belonging to one user is not accessible through another user's account.

---

## Data Model

The application is organized around user-owned academic resources.

### User

Stores account and profile information.

### Subject

Represents an academic subject and includes subject-specific information such as difficulty, color, ownership, and progress.

### Task

Represents an academic task or assignment with information such as subject association, priority, completion status, deadline, and ownership.

### Study Session

Represents a planned study activity and its associated timing information.

### Exam

Represents an upcoming examination and its scheduled date.

### Notification

Represents deadline-related notification information, read/unread state, and its associated academic activity.

---

## Project Structure

```text
Student-task-study-planner/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Local Development

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd Student-task-study-planner
```

### 2. Configure the Backend

Navigate to the backend:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as the reference.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

The local backend runs on the configured port, typically:

```text
http://localhost:5000
```

### 3. Configure the Frontend

Open a second terminal and navigate to the frontend:

```bash
cd frontend
npm install
```

For production deployments, configure the API URL through the frontend environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```

For local development, the existing Vite configuration can proxy API requests to the local backend.

Start the frontend:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, typically:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend

The backend uses environment variables for configuration and sensitive values.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Refer to `backend/.env.example` for the project's exact configuration.

### Frontend

The production API endpoint is configured through:

```env
VITE_API_URL=https://your-backend-url/api
```

Because Vite injects `VITE_*` variables during the build, the frontend must be rebuilt after changing this value.

> **Security:** Never place database credentials, JWT secrets, passwords, or other private secrets in frontend environment variables. Never commit real `.env` files to GitHub.

---

## Production Deployment

The application is structured for deployment using **Render** and **MongoDB Atlas**.

### Backend — Render Web Service

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

The backend should use the platform-provided `PORT` value in production and fall back to the local development port when running locally.

### Frontend — Render Static Site

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Configure the production API endpoint:

```env
VITE_API_URL=https://your-backend-url/api
```

The frontend build generates the production files in the `dist` directory.

### Database — MongoDB Atlas

MongoDB Atlas is used as the cloud database for storing authenticated users and application data.

---

## API Design

The backend follows a RESTful API architecture.

The API is organized around resources such as:

```text
/api/auth
/api/users
/api/subjects
/api/tasks
/api/study-sessions
/api/exams
/api/notifications
/api/health
```

Protected resources require authentication and operate on data belonging to the authenticated user.

---

## Security

Security considerations implemented in the application include:

- JWT-based authentication
- Password hashing
- Protected API endpoints
- Authentication middleware
- User-scoped database queries
- Environment-based configuration
- Separation of frontend and backend services
- `.env` files excluded from version control

---

## Engineering Highlights

This project demonstrates practical experience with:

- MERN full-stack architecture
- REST API development
- React component-based development
- Client-side routing
- Authentication and authorization
- JWT-based sessions
- MongoDB data modeling with Mongoose
- Axios-based API integration
- Protected frontend routes
- Backend authentication middleware
- Environment-based configuration
- Responsive UI development
- Theme management
- Calendar-based data presentation
- Deadline and notification logic
- Production deployment

---

## Future Scope

The current version focuses on the core student planning workflow. Potential future enhancements include:

- AI-assisted study planning
- Personalized study recommendations
- External calendar integration
- Email and push notifications
- Collaborative study planning
- Mobile application support
- Academic performance prediction

These enhancements are outside the current implementation and can be considered for future versions.

---

## Project Status

**Completed**

The current release includes authentication, profile management, subject management, task and assignment management, study sessions, focus timer, exam management, calendar integration, deadline notifications, dashboard-based progress tracking, and light/dark theme support.

---

## Author

**Asapu Roja Devi Sree**  
B.Tech — Computer Science and Engineering
