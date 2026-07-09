#  MEDCURE — Hospital Appointment Booking System

> **Internship Project** | Submitted to **FluentGrid Limited** | Author: **Nikhil Varma Billa**

A production-grade, full-stack hospital management platform featuring AI-powered patient assistance, role-based access control, and real-time appointment management.

---

##  Live Demo Credentials

Use these to log in immediately — no registration needed (or) you can create your account and login.

| Role    | Email                        | Password    |
|---------|------------------------------|-------------|
|  Patient | rahul.mehta@gmail.com        | patient123  |
|  Doctor  | rajesh.kumar@medcure.com     | doctor123   |
|  Admin   | admin@medcure.com            | admin123    |

>  **Offline Demo Mode**: If the backend is not running, the app automatically switches to a localStorage-based mock database. All features (login, booking, chatbot fallback) are fully usable without starting the Java backend.

---

##  Key Features

###  AI Medical Chatbot (Gemini 1.5 Flash)
- Powered by **Google Gemini 1.5 Flash** API
- Acts as a virtual medical receptionist for Medcure Hospital
- Answers questions about appointments, departments, and hospital services
- Graceful fallback with intelligent keyword-based responses when offline

###  Patient Portal
- Search doctors by name, specialization, or department
- View doctor profiles with experience, biography, and consultation fees
- Book available time slots with double-booking prevention
- View, reschedule, or cancel appointments
- Real-time in-app notification center

###  Doctor Dashboard
- Add and manage availability time slots
- View all booked appointments
- Write clinical notes and prescriptions
- Mark appointments as completed

###  Admin Panel
- Live analytics — total patients, doctors, bookings, cancellations
- Add/delete hospital departments
- View and remove doctor profiles

---

##  Technology Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, React Router v6   |
| Styling    | Vanilla CSS (custom design system)|
| Icons      | Lucide React                      |
| HTTP       | Axios                             |
| Backend    | Spring Boot 3.1 (Java 17)         |
| Database   | H2 In-Memory (dev) / MySQL (prod) |
| Auth       | JWT (JSON Web Token) + BCrypt     |
| AI         | Google Gemini 1.5 Flash API       |

---

##  Project Structure

```
hospital-booking-system/
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state, API layer, offline mock DB
│   │   ├── views/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PatientDashboard.jsx  # Includes AI Chatbot UI
│   │   │   ├── DoctorDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx                  # Routes and protected route logic
│   │   ├── main.jsx
│   │   └── index.css                # Global design system
│   ├── index.html
│   └── package.json
│
├── backend/                         # Spring Boot REST API
│   ├── src/main/java/com/hospital/booking/
│   │   ├── config/                  # Security, JWT, CORS
│   │   ├── controller/              # REST endpoints
│   │   ├── service/                 # Business logic + GeminiService
│   │   ├── entity/                  # JPA entities
│   │   ├── repository/              # Spring Data JPA
│   │   ├── dto/                     # Request/Response DTOs
│   │   └── exception/               # Global exception handling
│   ├── src/main/resources/
│   │   └── application.yml          # App configuration
│   └── pom.xml
│
├── CarePlus-Hospital-API.postman_collection.json  # API test collection
├── run-frontend.bat                 # One-click frontend launcher
├── run-backend.bat                  # One-click backend launcher
└── README.md
```

---

##  Running the Project Locally

### Prerequisites

| Tool     | Version   | Download                          |
|----------|-----------|-----------------------------------|
| Node.js  | 18+       | https://nodejs.org/               |
| Java JDK | 17        | https://adoptium.net/             |
| Maven    | 3.8+      | https://maven.apache.org/         |
| Git      | any       | https://git-scm.com/              |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/NikhilVarmaBilla7/hospital-booking-system.git
cd hospital-booking-system
```

---

### Step 2 — Set Up Gemini API Key (for AI Chatbot)

Create a file `backend/.env` with your Gemini API key:

```
GEMINI_API_KEY=your-google-gemini-api-key-here
```

> Get a free key at: https://aistudio.google.com/app/apikey
> Without this key, the chatbot still works using intelligent fallback responses.

---

### Step 3 — Run the Frontend

Open a terminal and run:

```bash
cd frontend
npm install
npm run dev
```

 Frontend starts at: **http://localhost:5173**

---

### Step 4 — Run the Backend

Open a second terminal and run:

```bash
cd backend
mvn spring-boot:run
```

Or just double-click **`run-backend.bat`** (auto-loads the API key from `.env`).

 Backend REST API starts at: **http://localhost:8080**

>  H2 Database console: **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:hospitaldb`)

---

##  Configured Hospital Departments

The author has created and setup 20 departments :

| # | Department              | # | Department          |
|---|-------------------------|---|---------------------|
| 1 | Cardiology              | 11| Gastroenterology    |
| 2 | Pediatrics              | 12| Pulmonology         |
| 3 | Orthopedics             | 13| Nephrology          |
| 4 | Neurology               | 14| Urology             |
| 5 | Dermatology             | 15| Endocrinology       |
| 6 | Gynecology & Obstetrics | 16| Rheumatology        |
| 7 | Ophthalmology           | 17| Hematology          |
| 8 | ENT                     | 18| General Surgery     |
| 9 | Psychiatry              | 19| Dentistry           |
|10 | Oncology                | 20| Physiotherapy       |

---

## 📡 Backend API Endpoints

### Authentication
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login, get JWT    |

### Patient
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/doctors                      | List / search doctors    |
| GET    | /api/doctors/{id}/slots           | Get available slots      |
| POST   | /api/appointments/book            | Book an appointment      |
| GET    | /api/appointments/my              | View my appointments     |
| PUT    | /api/appointments/{id}/reschedule | Reschedule appointment   |
| DELETE | /api/appointments/{id}            | Cancel appointment       |
| POST   | /api/chat                         | AI Chatbot query         |

### Doctor
| Method | Endpoint                                  | Description            |
|--------|-------------------------------------------|------------------------|
| POST   | /api/doctor/slots                         | Add availability slot  |
| GET    | /api/doctor/appointments                  | View clinic schedule   |
| PUT    | /api/doctor/appointments/{id}/clinical    | Add clinical notes     |
| PUT    | /api/doctor/appointments/{id}/complete    | Mark as completed      |

### Admin
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | /api/admin/reports          | Dashboard analytics   |
| GET    | /api/admin/departments      | List departments      |
| POST   | /api/admin/departments      | Add department        |
| DELETE | /api/admin/departments/{id} | Delete department     |
| DELETE | /api/admin/doctors/{id}     | Remove doctor profile |

---

##  Security Architecture

- **JWT Authentication** — Stateless token-based auth issued on login
- **Role-Based Access Control** — `PATIENT`, `DOCTOR`, `ADMIN` roles enforced at API level
- **BCrypt Password Hashing** — All passwords securely hashed
- **CORS Configured** — Frontend-backend communication secured
- **Secret Management** — API keys loaded from environment variables (never committed to git)

---

##  Scripts Reference

| Command               | Description                          |
|-----------------------|--------------------------------------|
| `npm install`         | Install frontend dependencies        |
| `npm run dev`         | Start Vite dev server (port 5173)    |
| `npm run build`       | Build production bundle              |
| `mvn spring-boot:run` | Start Spring Boot backend (port 8080)|
| `run-backend.bat`     | One-click backend start (Windows)    |
| `run-frontend.bat`    | One-click frontend start (Windows)   |

---

##  Postman Collection

Import `CarePlus-Hospital-API.postman_collection.json` to test all API endpoints directly.

---

##  License

**Author**: Nikhil Varma Billa  
**Submitted as**: Internship Project — FluentGrid Limited  
All rights reserved © 2026
