# 🎉 Planora — Frontend

**A modern event management platform built with Next.js 16**


[Live Site](https://planora-frontend-orpin.vercel.app) • [Backend Repo](https://github.com/Sabbir-Rayhan/Planora-backend) • [API Docs](https://planora-backend-production-d7e8.up.railway.app)


---

## 📌 Project Overview

Planora is a full-stack event management platform where users can create, manage, and join events. This repository contains the **Next.js frontend** with Server Side Rendering for public pages and Client Side Rendering for interactive components.

---

## 🔗 Live URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend Live | https://planora-frontend-orpin.vercel.app |
| 🚀 Backend API | https://planora-backend-production-d7e8.up.railway.app |
| 📁 Frontend Repo | https://github.com/Sabbir-Rayhan/Planora-frontend |
| 📁 Backend Repo | https://github.com/Sabbir-Rayhan/Planora-backend |

---

## 🔐 Admin Credentials
```
Email    : admin@planora.com
Password : Mahee@123
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Shadcn UI | Pre-built UI components |
| Zustand | Client-side auth state management |
| Axios | HTTP client for mutations |
| React Hook Form | Form handling |
| Zod | Form validation |
| Embla Carousel | Events slider |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Vercel | Frontend deployment |

---

## ✨ Features

### 🏠 Homepage
- Dynamic hero section with admin-selected featured event
- Upcoming events slider with autoplay (SSR)
- Event category filters
- Call to action section
- Responsive navbar with glassmorphism design
- Professional footer

### 📅 Events
- Browse all events with search and filters
- Filter by type (Public/Private) and fee (Free/Paid)
- Event detail page with full information
- Join button changes based on event type and user status

### 🔐 Authentication
- User registration with validation
- Login with role-based redirect
- Persistent auth state with Zustand + localStorage
- Redirect back to previous page after login

### 👤 User Dashboard
- Glassmorphism dark theme design
- Sidebar navigation
- My Events — create, view, delete events
- My Participations — view joined events with status
- Invitations — accept/decline/pay & accept
- My Reviews — view, edit, delete reviews
- Settings — update profile, notification preferences

### 👑 Admin Dashboard
- Dark aesthetic design with sidebar
- Manage Users — block/activate users
- Manage Events — feature/unfeature/delete events
- Payments — view all transactions and revenue

### 💳 Payment Flow
- SSLCommerz payment integration
- Payment success/fail/cancel pages
- Smart join button — shows pay button again if payment abandoned

### 🌟 Reviews
- Star rating system (1-5)
- Write, edit, delete reviews
- Average rating display

---

## 📁 Project Structure
```
planora-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Login page (CSR)
│   │   │   └── register/page.tsx     # Register page (CSR)
│   │   ├── (main)/
│   │   │   ├── layout.tsx            # Navbar + Footer layout
│   │   │   ├── page.tsx              # Homepage (SSR)
│   │   │   ├── events/
│   │   │   │   ├── page.tsx          # Events listing (SSR)
│   │   │   │   └── [eventId]/
│   │   │   │       └── page.tsx      # Event details (SSR)
│   │   │   └── profile/page.tsx      # Profile page
│   │   ├── dashboard/
│   │   │   ├── admin/page.tsx        # Admin dashboard
│   │   │   ├── user/page.tsx         # User dashboard
│   │   │   └── layout.tsx            # Dashboard auth guard
│   │   └── payment/
│   │       ├── success/page.tsx
│   │       ├── fail/page.tsx
│   │       └── cancel/page.tsx
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Navbar.tsx            # Responsive navbar (CSR)
│   │   │   ├── Footer.tsx            # Footer (Server)
│   │   │   └── Providers.tsx         # React Query provider
│   │   ├── home/
│   │   │   ├── HeroSection.tsx       # Featured event (SSR)
│   │   │   ├── UpcomingEvents.tsx    # Events fetch (SSR)
│   │   │   ├── EventsSlider.tsx      # Slider (CSR)
│   │   │   ├── EventCategories.tsx   # Categories (Server)
│   │   │   └── CallToAction.tsx      # CTA (Server)
│   │   ├── events/
│   │   │   ├── EventFilters.tsx      # Search filters (CSR)
│   │   │   ├── JoinEventButton.tsx   # Join logic (CSR)
│   │   │   ├── OrganizerControls.tsx # Manage participants (CSR)
│   │   │   ├── AddReviewForm.tsx     # Review form (CSR)
│   │   │   └── EventReviews.tsx      # Reviews list (SSR)
│   │   └── dashboard/
│   │       ├── user/                 # User dashboard components
│   │       └── admin/                # Admin dashboard components
│   ├── lib/
│   │   └── axios.ts                  # Axios instance with interceptors
│   ├── store/
│   │   └── authStore.ts              # Zustand auth store
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── .env.local.example
├── next.config.ts
└── package.json
```

---

## 🏗️ Rendering Architecture

| Component | Rendering | Reason |
|-----------|-----------|--------|
| Homepage | **SSR** | SEO, featured event from server |
| Events listing | **SSR** | SEO, fast initial load |
| Event details | **SSR** | SEO, social sharing |
| HeroSection | **SSR** | Featured event fetch on server |
| UpcomingEvents | **SSR** | Events fetch on server |
| EventFilters | **CSR** | Needs useState for filter state |
| JoinEventButton | **CSR** | Needs onClick, dynamic status |
| Navbar | **CSR** | Needs scroll listener, auth state |
| Dashboard | **CSR** | Needs tab state, mutations |

---

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Landing page with hero, slider, categories |
| Events | `/events` | Browse all events with filters |
| Event Details | `/events/[id]` | Full event info + join button |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| User Dashboard | `/dashboard/user` | User management panel |
| Admin Dashboard | `/dashboard/admin` | Admin control panel |
| Profile | `/profile` | Update profile |
| Payment Success | `/payment/success` | Payment confirmation |
| Payment Fail | `/payment/fail` | Payment failure |

---

## 🎨 Design System

- **Primary**: Blue (`#3B82F6`) to Purple (`#9333EA`) gradient
- **Dark Theme**: Dashboard uses glassmorphism with dark backgrounds
- **Typography**: Geist font family
- **Components**: Shadcn UI + custom Tailwind components
- **Responsive**: Mobile-first, works on all screen sizes

---

## 🌍 Deployment

The frontend is deployed on **Vercel** with:
- Automatic deployments from GitHub main branch
- Environment variables configured in Vercel dashboard
- Edge network for global performance


---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js 18+
- Git
- Backend server running (see backend README)

### Step 1 — Clone the repository
bash
git clone https://github.com/Sabbir-Rayhan/Planora-frontend.git
cd planora-frontend

### Step 2 — Install dependencies
bash
npm install


### Step 3 — Setup environment variables

Create a `.env.local` file:
env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
API_URL=http://localhost:5000/api/v1


### Step 4 — Start development server
bash
npm run dev

App runs at: `http://localhost:3000`

### Step 5 — Build for production
bash
npm run build
npm start

---

Thank You.
