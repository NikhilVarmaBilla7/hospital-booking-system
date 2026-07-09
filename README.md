# MEDCURE HOSPITALS — Hospital Appointment Booking System

A full-stack hospital appointment management platform built with **React (Vite)** for the frontend and **Spring Boot** for the backend. Patients can search doctors and book appointments, doctors can manage their schedule and write clinical notes, and admins can oversee the entire system.

---

## Features

### Patient
- Search doctors by name, specialization, or department
- View doctor profiles with experience, biography, and consultation fees
- Book available time slots
- View, reschedule, or cancel appointments
- Receive in-app notifications
- Chat with the MEDCURE virtual assistant

### Doctor
- Add availability time slots
- View all booked appointments
- Write clinical notes and prescriptions
- Mark appointments as completed

### Admin
- View live analytics (total patients, doctors, bookings, cancellations)
- Add and delete hospital departments
- View and remove doctor profiles

---

## Technology Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React 18, Vite, React Router |
| Styling    | Vanilla CSS (custom design system) |
| Icons      | Lucide React                |
| HTTP       | Axios                        |
| Backend    | Spring Boot (Java 17)        |
| Database   | MySQL / H2 (configurable)    |
| Auth       | JWT (JSON Web Token)         |

> **Offline / Demo Mode**: When the backend is not running, the app automatically falls back to a localStorage-based mock database. All features are fully usable without starting the Java backend.

---

## Project Structure

```
hospital-booking-system/
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state, API layer, offline mock DB
│   │   ├── views/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx                  # Routes and protected route logic
│   │   ├── main.jsx
│   │   └── index.css                # Global design system
│   ├── index.html
│   └── package.json
│
├── backend/                   # Spring Boot application
│   └── src/main/java/...
│
├── CarePlus-Hospital-API.postman_collection.json
├── run-frontend.bat
├── run-backend.bat
└── README.md
```

---

## Running the Project in VS Code

### Prerequisites

Make sure you have the following installed:

| Tool       | Version   | Download                          |
|------------|-----------|-----------------------------------|
| Node.js    | 18 or above | https://nodejs.org/               |
| npm        | comes with Node.js | —                        |
| Java JDK   | 17        | https://adoptium.net/             |
| Maven      | 3.8+      | https://maven.apache.org/         |
| Git        | any       | https://git-scm.com/              |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/hospital-booking-system.git
cd hospital-booking-system
```

---

### Step 2 — Open in VS Code

```bash
code .
```

---

### Step 3 — Run the Frontend

Open a terminal in VS Code (`Ctrl + `` ` ```) and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: **http://localhost:5173**

> You can use the app fully in demo mode even without starting the backend.

---

### Step 4 — Run the Backend (Optional)

Open a second terminal in VS Code and run:

```bash
cd backend
mvn spring-boot:run
```

The backend REST API will start at: **http://localhost:8080**

> If the backend is not running, the frontend automatically switches to offline demo mode using a built-in localStorage simulator.

---

## Demo Credentials

Use these to log in directly from the login page (click the quick-fill buttons):

| Role    | Email                        | Password    |
|---------|------------------------------|-------------|
| Patient | rahul.mehta@gmail.com        | patient123  |
| Doctor  | rajesh.kumar@medcure.com     | doctor123   |
| Admin   | admin@medcure.com            | admin123    |

> Patients can register with any personal email (Gmail, Outlook, etc.).  
> Doctors and Admins use organisation emails ending in `@medcure.com`.

---

## Hospital Departments

The system includes 20 pre-configured departments:

| # | Department             | # | Department          |
|---|------------------------|---|---------------------|
| 1 | Cardiology             | 11 | Gastroenterology   |
| 2 | Pediatrics             | 12 | Pulmonology        |
| 3 | Orthopedics            | 13 | Nephrology         |
| 4 | Neurology              | 14 | Urology            |
| 5 | Dermatology            | 15 | Endocrinology      |
| 6 | Gynecology & Obstetrics| 16 | Rheumatology       |
| 7 | Ophthalmology          | 17 | Hematology         |
| 8 | ENT                    | 18 | General Surgery    |
| 9 | Psychiatry             | 19 | Dentistry          |
| 10| Oncology               | 20 | Physiotherapy      |

---

## Backend API Endpoints

### Authentication
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Register new user   |
| POST   | /api/auth/login       | Login, get JWT      |

### Patient
| Method | Endpoint                            | Description                  |
|--------|-------------------------------------|------------------------------|
| GET    | /api/doctors                        | List / search doctors        |
| GET    | /api/doctors/{id}/slots             | Get available slots          |
| POST   | /api/appointments/book              | Book an appointment          |
| GET    | /api/appointments/my                | View my appointments         |
| PUT    | /api/appointments/{id}/reschedule   | Reschedule appointment       |
| DELETE | /api/appointments/{id}              | Cancel appointment           |

### Doctor
| Method | Endpoint                                   | Description              |
|--------|--------------------------------------------|--------------------------|
| POST   | /api/doctor/slots                          | Add availability slot    |
| GET    | /api/doctor/appointments                   | View clinic appointments |
| PUT    | /api/doctor/appointments/{id}/clinical     | Add clinical notes       |
| PUT    | /api/doctor/appointments/{id}/complete     | Mark as completed        |

### Admin
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/admin/reports          | Dashboard analytics      |
| GET    | /api/admin/departments      | List departments         |
| POST   | /api/admin/departments      | Add department           |
| DELETE | /api/admin/departments/{id} | Delete department        |
| DELETE | /api/admin/doctors/{id}     | Remove doctor profile    |

---

## VS Code Recommended Extensions

Install these for the best development experience:

- **ES7+ React/Redux/React-Native snippets** — React snippets
- **Prettier – Code formatter** — Auto-format on save
- **ESLint** — Code linting
- **Auto Rename Tag** — Rename paired JSX/HTML tags
- **GitLens** — Git blame and history

---

## Scripts Reference

| Command          | Description                        |
|------------------|------------------------------------|
| `npm install`    | Install frontend dependencies      |
| `npm run dev`    | Start Vite dev server (port 5173)  |
| `npm run build`  | Build production bundle            |
| `npm run preview`| Preview the production build       |
| `mvn spring-boot:run` | Start Spring Boot backend (port 8080) |


---

## License

Author: Nikhil Varma Billa

This project is submitted as an Internship project for FluentGrid limited. All rights reserved.
