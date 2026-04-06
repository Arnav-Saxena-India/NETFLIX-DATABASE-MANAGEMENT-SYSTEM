<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<h1 align="center">🎬 Netflix Database Management System</h1>

<p align="center">
  <strong>A full-stack OTT platform management system built as a DBMS course project.</strong><br/>
  Manage users, shows, subscriptions, payments, reviews, and get smart content recommendations — all through a sleek Netflix-inspired dark UI.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-database-schema">Schema</a> •
  <a href="#-getting-started">Setup</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## ✨ Features

| Module | Description |
|---|---|
| **📊 Admin Dashboard** | Real-time KPI cards (users, revenue, shows, subscriptions) with interactive Recharts area graphs and activity feed |
| **👤 User Management** | Full CRUD with search, inline editing, age validation, and email uniqueness enforcement |
| **🎬 Show Catalog** | Browse, add, edit, and delete shows with multi-genre tagging via a junction table |
| **📦 Subscription Plans** | Manage tiered plans (Mobile, Basic, Standard, Premium) with price and duration controls |
| **💳 Payment Processing** | Record payments with UPI/Card/NetBanking/Wallet modes; auto-linked to users and plans |
| **📺 Watch History** | Track viewing sessions with device type, season/episode, completion %, and duration watched |
| **⭐ Reviews & Ratings** | 1–5 star rating system with unique constraint per user-show pair and text comments |
| **📈 Reports & Analytics** | Revenue-by-plan breakdown, plan distribution pie charts, subscription expiry alerts, and GST bill generation |
| **🤖 Smart Recommendations** | Genre-weighted recommendation engine — analyzes watch history to suggest unwatched content with match percentages |
| **🎞️ Browse Mode** | Netflix-style user-facing UI with hero banner, genre carousels, and settings modal |
| **🔐 Role-Based Access** | Dual login — **Admin** gets the management dashboard, **User** gets the browse/streaming interface |

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy 2.0
- **Validation:** Pydantic v2
- **Database:** MySQL 8.0 (via PyMySQL)
- **Server:** Uvicorn (ASGI)

### Frontend
- **Library:** React 19 (Vite)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Routing:** React Router v7
- **Notifications:** React Hot Toast

---

## 🗃️ Database Schema

The system uses a **normalized relational schema** with 7 core tables and 1 junction table:

```
┌──────────────────┐       ┌───────────────────────┐
│      users       │       │   subscription_plans   │
├──────────────────┤       ├───────────────────────┤
│ PK user_id       │       │ PK plan_id            │
│    name          │       │    plan_name           │
│    email (UQ)    │       │    price               │
│    password      │       │    duration            │
│    age           │       └──────────┬────────────┘
│    created_at    │                  │
└───────┬──────────┘                  │
        │                             │
        │  ┌──────────────────────────┘
        │  │
        ▼  ▼
┌──────────────────┐       ┌──────────────────┐
│    payments      │       │      shows       │
├──────────────────┤       ├──────────────────┤
│ PK payment_id    │       │ PK show_id       │
│ FK user_id       │       │    title         │
│ FK plan_id       │       │    release_year  │
│    amount        │       │    language      │
│    mode          │       │    duration      │
│    date          │       └──────┬───────────┘
└──────────────────┘              │
                                  │
        ┌─────────────────────────┤
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│  watch_history   │    │   show_genres    │
├──────────────────┤    ├──────────────────┤
│ PK history_id    │    │ PK,FK show_id    │
│ FK user_id       │    │ PK,FK genre_id   │
│ FK show_id       │    └────────┬─────────┘
│    last_access   │             │
│    completion_%  │             ▼
│    season        │    ┌──────────────────┐
│    episode       │    │     genres       │
│    duration      │    ├──────────────────┤
│    device        │    │ PK genre_id      │
└──────────────────┘    │    genre_name    │
                        └──────────────────┘
        ┌──────────────────┐
        │     reviews      │
        ├──────────────────┤
        │ PK review_id     │
        │ FK user_id       │
        │ FK show_id       │
        │    rating (1-5)  │
        │    comment       │
        │ UQ (user, show)  │
        └──────────────────┘
```

### Key Constraints
- **Referential Integrity:** All foreign keys use `ON DELETE CASCADE`
- **Domain Constraints:** Age `CHECK (13–120)`, Rating `CHECK (1–5)`, Completion `CHECK (0–100)`
- **Uniqueness:** One review per user-show pair, unique emails
- **ENUM Types:** Payment mode, Device type

---

## 🚀 Getting Started

### Prerequisites
| Tool | Version |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

### 1. Clone the Repository
```bash
git clone https://github.com/Arnav-Saxena-India/NETFLIX-DATABASE-MANAGEMENT-SYSTEM.git
cd NETFLIX-DATABASE-MANAGEMENT-SYSTEM
```

### 2. Set Up the Database
```sql
-- In MySQL client or Workbench:
CREATE DATABASE ott_db;
```
```bash
mysql -u root -p ott_db < db/schema.sql
mysql -u root -p ott_db < db/seed.sql
```

### 3. Start the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Set your database password:
```powershell
# PowerShell
$env:DB_URL="mysql+pymysql://root:YOUR_PASSWORD@localhost/ott_db"
```
```bash
# macOS/Linux
export DB_URL="mysql+pymysql://root:YOUR_PASSWORD@localhost/ott_db"
```

Launch the server:
```bash
uvicorn app.main:app --reload --port 8000
```
> API available at `http://localhost:8000` · Swagger docs at `http://localhost:8000/docs`

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
> App available at `http://localhost:5173`

---

## 📡 API Reference

Base URL: `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | List all users |
| `POST` | `/users` | Create a new user |
| `PUT` | `/users/{id}` | Update a user |
| `DELETE` | `/users/{id}` | Delete a user |
| `GET` | `/shows` | List all shows |
| `POST` | `/shows` | Add a new show |
| `PUT` | `/shows/{id}` | Update a show |
| `DELETE` | `/shows/{id}` | Delete a show |
| `GET` | `/genres` | List all genres |
| `GET` | `/subscription-plans` | List subscription plans |
| `GET` | `/payments` | List all payments |
| `POST` | `/payments` | Record a payment |
| `GET` | `/watch-history` | List watch history |
| `POST` | `/watch-history` | Add watch record |
| `GET` | `/reviews` | List all reviews |
| `POST` | `/reviews` | Add a review |
| `GET` | `/recommendations/{user_id}` | Get personalized recommendations |
| `GET` | `/reports/revenue-by-plan` | Revenue breakdown by plan |
| `GET` | `/reports/plan-distribution` | Subscriber distribution |
| `GET` | `/reports/expiry-alerts` | Subscription expiry warnings |
| `GET` | `/reports/bill?user_id=&plan_id=` | Generate GST bill |
| `GET` | `/dashboard/stats` | Dashboard KPI stats |

> 📖 Full interactive docs available at [`/docs`](http://localhost:8000/docs) (Swagger UI)

---

## 📂 Project Structure

```
NETFLIX-DATABASE-MANAGEMENT-SYSTEM/
│
├── backend/                    # FastAPI REST API
│   ├── app/
│   │   ├── main.py             # App entry point & route registration
│   │   ├── database.py         # SQLAlchemy engine & session config
│   │   ├── models/             # ORM models (User, Show, Payment, etc.)
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── crud/               # Database query functions
│   │   └── routers/            # API route handlers
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx             # Root component with routing & auth
│   │   ├── api/client.js       # Axios HTTP client config
│   │   ├── components/         # Reusable UI (Sidebar, Header, DataTable)
│   │   ├── pages/              # Page views (Dashboard, Browse, Reports, etc.)
│   │   └── data/               # Mock/seed data for development
│   ├── package.json
│   └── tailwind.config.js
│
├── db/
│   ├── schema.sql              # DDL — complete table definitions
│   └── seed.sql                # Sample data (users, shows, payments, etc.)
│
├── HOW_TO_RUN.txt              # Detailed setup instructions
└── README.md                   # ← You are here
```

---

## 🧠 How Recommendations Work

The recommendation engine uses a **genre-weighted collaborative approach**:

1. **Analyze** the user's watch history to extract all genres they've consumed
2. **Weight** each genre by frequency (more watches = higher preference signal)
3. **Score** every unwatched show by summing its genre weights
4. **Rank** by match percentage and return the top 5 recommendations

```
Match % = (Σ genre_weights for show) / total_weight × 100
```

---

## 👨‍💻 Author

**Arnav Saxena**

---

<p align="center">
  <sub>Built with ❤️ as a DBMS Course Project</sub>
</p>
