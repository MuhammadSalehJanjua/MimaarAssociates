# 🏗️ Mimaar Associates — Production-Grade Website Plan

> **Company:** Mimaar Associates — Supply and Services
> **Location:** Office No. UG-100, Defence Residency Shops, DHA II, Islamabad
> **Domain:** `mimaarassociate.com`
> **Current Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS v4 · shadcn/ui

---

## 📌 Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Architecture Overview](#2-architecture-overview)
3. [Backend Stack & Database](#3-backend-stack--database)
4. [Frontend Redesign — Styles & Animations](#4-frontend-redesign--styles--animations)
5. [Page & Route Structure](#5-page--route-structure)
6. [Backend API Routes](#6-backend-api-routes)
7. [Admin Dashboard](#7-admin-dashboard)
8. [Authentication](#8-authentication)
9. [File Uploads & Media Management](#9-file-uploads--media-management)
10. [SEO & Performance](#10-seo--performance)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Environment Variables](#12-environment-variables)
13. [Phase-wise Execution Plan](#13-phase-wise-execution-plan)
14. [New Dependencies to Install](#14-new-dependencies-to-install)
15. [Folder Structure (Final)](#15-folder-structure-final)

---

## 1. Current State Audit

### ✅ What exists
| Area | Status |
|---|---|
| Next.js 14 App Router | ✅ Configured |
| Tailwind CSS v4 + PostCSS | ✅ Configured |
| shadcn/ui (50 components) | ✅ Installed |
| Theme Provider (next-themes) | ✅ Exists but **not wired into layout** |
| Hero Section | ✅ Static, no animation |
| Services Section (7 services) | ✅ Static cards |
| About Section | ✅ Static |
| Projects Section (4 projects) | ✅ Hardcoded data |
| Contact Section + Form | ✅ UI only, **no backend submission** |
| Footer | ✅ Static |
| Header (desktop + mobile) | ✅ Anchor-link navigation |
| Image assets (6 real photos) | ✅ In `/public` |
| Vercel Analytics | ✅ Configured |
| Dark mode CSS vars | ✅ Defined but **not toggleable** |

### ❌ What's missing for production
- No backend / API routes
- No database
- No authentication or admin panel
- No dynamic content (projects, services, testimonials)
- No contact form submission handler
- No image upload / media management
- No scroll animations or page transitions
- No loading states or skeletons
- No SEO metadata per page (only root layout)
- No sitemap.xml / robots.txt
- No error / 404 pages
- No rate limiting or security headers
- No email integration (contact form, newsletter)
- Dark mode toggle not exposed in the UI

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐             │
│  │  Public   │  │  Admin   │  │  API      │             │
│  │  Pages    │  │  Dashboard│  │  Routes   │             │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘             │
│       │              │              │                    │
│       └──────────────┼──────────────┘                    │
│                      │                                   │
├──────────────────────┼───────────────────────────────────┤
│              Prisma ORM Layer                            │
├──────────────────────┼───────────────────────────────────┤
│             PostgreSQL Database                          │
│   (Neon / Supabase / local Docker)                      │
└──────────────────────────────────────────────────────────┘

External Services:
  • Resend — transactional emails (contact form, notifications)
  • Cloudinary / UploadThing — image uploads & CDN
  • NextAuth.js v5 — admin authentication
  • Framer Motion — scroll/page animations
```

**Why this stack?**
- **Prisma + PostgreSQL:** Type-safe ORM, easy migrations, excellent Next.js integration. Neon offers a generous free tier for PostgreSQL.
- **Next.js API Routes (Route Handlers):** Already in the project — zero config, co-located with the frontend, serverless-ready.
- **Resend:** Modern email API with free tier (100 emails/day) — perfect for contact forms.
- **NextAuth.js v5:** First-party Next.js auth, supports credentials + OAuth. Lightweight for a single-admin site.

---

## 3. Backend Stack & Database

### 3.1 Database — PostgreSQL via Neon (Free Tier)

**Schema (Prisma):**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth ───────────────────────────────────────────────
model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  passwordHash  String
  role          Role     @default(ADMIN)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Role {
  ADMIN
  SUPER_ADMIN
}

// ─── Services ───────────────────────────────────────────
model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  icon        String   // Lucide icon name e.g. "Building2"
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ─── Projects ───────────────────────────────────────────
model Project {
  id          String   @id @default(cuid())
  title       String
  category    String
  description String
  content     String?  @db.Text // Rich text / markdown
  images      ProjectImage[]
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProjectImage {
  id        String  @id @default(cuid())
  url       String
  alt       String?
  order     Int     @default(0)
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

// ─── Testimonials ───────────────────────────────────────
model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String?  // e.g. "Homeowner, DHA Phase II"
  content   String
  rating    Int      @default(5)
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

// ─── Contact Submissions ────────────────────────────────
model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  service   String?
  message   String   @db.Text
  status    ContactStatus @default(NEW)
  notes     String?  @db.Text // Admin internal notes
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ContactStatus {
  NEW
  READ
  RESPONDED
  ARCHIVED
}

// ─── Newsletter Subscribers ─────────────────────────────
model Subscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

// ─── Site Settings (Key-Value) ──────────────────────────
model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text
}
```

### 3.2 Prisma Setup Commands

```bash
npm install prisma @prisma/client
npx prisma init
# After editing schema.prisma:
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed   # seed initial admin + services
```

### 3.3 Database Client Singleton

```typescript
// lib/db.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

---

## 4. Frontend Redesign — Styles & Animations

### 4.1 Color Palette Overhaul

Replace the current purple accent with a **luxury construction brand palette**:

```
Primary:      #1A1A2E  (Deep Navy)       — Authority, trust
Secondary:    #C9A84C  (Warm Gold)       — Luxury, premium
Accent:       #E8DCC8  (Warm Cream)      — Elegance, warmth
Background:   #FAFAF8  (Off-White)       — Clean, modern
Foreground:   #1A1A2E  (Deep Navy)       — High contrast
Muted:        #F0EDE6  (Pale Sand)       — Subtle sections
Destructive:  #D32F2F  (Deep Red)        — Errors, warnings

Dark Mode:
Background:   #0D0D1A  (True Dark)
Card:         #151525  (Elevated Dark)
Gold remains: #C9A84C  (Contrast preserved)
```

### 4.2 Typography

```css
/* Import in layout.tsx or globals.css */
/* Primary: "Plus Jakarta Sans" — Modern, geometric, premium feel */
/* Display: "Playfair Display" — Luxury serif for hero headlines */
```

```bash
npm install @fontsource/plus-jakarta-sans @fontsource/playfair-display
```

### 4.3 Animation Library — Framer Motion

```bash
npm install framer-motion
```

#### Animation Components to Build

| Component | Animation | Trigger |
|---|---|---|
| `<FadeIn>` | Opacity 0→1, translateY 30→0 | Scroll into viewport |
| `<SlideIn>` | Slide from left/right | Scroll into viewport |
| `<StaggerChildren>` | Children animate in sequence | Parent in viewport |
| `<CountUp>` | Number counter (0 → target) | Scroll into viewport |
| `<ParallaxImage>` | Subtle Y-axis parallax | Scroll position |
| `<PageTransition>` | Fade + slide between routes | Route change |
| `<MagneticButton>` | Subtle cursor-follow on hover | Mouse proximity |
| `<TextReveal>` | Line-by-line text reveal | Scroll into viewport |
| `<ImageReveal>` | Clip-path wipe reveal | Scroll into viewport |

#### Implementation Pattern

```tsx
// components/animations/fade-in.tsx
"use client"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  className,
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const directionMap = {
    up:    { y: 40, x: 0 },
    down:  { y: -40, x: 0 },
    left:  { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### 4.4 Specific Section Upgrades

#### Hero Section
- **Full-viewport height** with video background or high-res image with Ken Burns effect
- **Animated gradient overlay** (subtle color shifting)
- **Text reveal animation** — headline words stagger in
- **Floating stat cards** with glassmorphism (`backdrop-blur`, border with `rgba`)
- **Scroll indicator** — animated chevron bouncing at bottom
- **Particle/grid pattern** overlay for depth

#### Header
- **Shrink on scroll** — height reduces, adds shadow after 100px
- **Active section highlighting** using Intersection Observer
- **Animated mobile menu** — slide-in from right with staggered link animations
- **Logo animation** — subtle shine effect on hover

#### Services Section
- **Card hover:** 3D tilt effect (CSS `perspective` + `transform`)
- **Icon animation:** Lucide icons animate on hover (scale + color shift)
- **Staggered entrance:** Cards fade in sequentially, 100ms delay each
- **Background pattern:** Subtle dot grid or architectural blueprint pattern

#### Projects Section
- **Masonry / bento grid layout** instead of uniform 2-column
- **Image hover:** Zoom + gradient overlay with project info sliding up
- **Category filter tabs** with animated active indicator (underline slides)
- **Lightbox modal** for full project gallery view
- **Cursor:** Custom "View Project" cursor on hover

#### About Section
- **Split layout** with parallax image
- **Animated counter** for stats (Years, Projects, Clients)
- **Timeline component** for company history/milestones
- **Team member cards** (if applicable)

#### Testimonials Section *(NEW)*
- **Auto-scrolling carousel** with pause on hover
- **Quote animation** — text fades between testimonials
- **Star rating** with fill animation
- **Avatar with subtle float animation**

#### Contact Section
- **Interactive map** embed (Google Maps or Mapbox)
- **Form validation** with `react-hook-form` + `zod` (already installed)
- **Submit animation** — button morphs into loading spinner → checkmark
- **Toast notifications** via `sonner` (already installed)

#### Footer
- **Animated gradient border** at top
- **Social media icons** with hover scale + color transition
- **Back-to-top button** with smooth scroll + fade-in after scrolling down
- **Newsletter form** connected to backend

### 4.5 Global Effects

```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--background);
}
::-webkit-scrollbar-thumb {
  background: var(--secondary);
  border-radius: 4px;
}

/* Selection color */
::selection {
  background: oklch(0.78 0.14 85); /* Gold tint */
  color: var(--foreground);
}

/* Smooth page transitions */
main {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Glassmorphism utility */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

---

## 5. Page & Route Structure

```
app/
├── (public)/                    # Public-facing layout group
│   ├── layout.tsx               # Public layout (header + footer)
│   ├── page.tsx                 # Landing page (home)
│   ├── services/
│   │   └── page.tsx             # All services detail page
│   ├── projects/
│   │   ├── page.tsx             # Projects gallery with filters
│   │   └── [slug]/
│   │       └── page.tsx         # Individual project detail page
│   ├── about/
│   │   └── page.tsx             # Full about page
│   └── contact/
│       └── page.tsx             # Contact page with map
│
├── admin/                       # Admin dashboard
│   ├── layout.tsx               # Admin layout (sidebar + topbar)
│   ├── page.tsx                 # Dashboard overview
│   ├── projects/
│   │   ├── page.tsx             # Manage projects (CRUD table)
│   │   ├── new/page.tsx         # Create project form
│   │   └── [id]/edit/page.tsx   # Edit project form
│   ├── services/
│   │   └── page.tsx             # Manage services
│   ├── contacts/
│   │   └── page.tsx             # View/manage contact submissions
│   ├── testimonials/
│   │   └── page.tsx             # Manage testimonials
│   ├── subscribers/
│   │   └── page.tsx             # View newsletter subscribers
│   └── settings/
│       └── page.tsx             # Site settings
│
├── api/                         # API Route Handlers
│   ├── auth/[...nextauth]/
│   │   └── route.ts             # NextAuth.js handler
│   ├── contact/
│   │   └── route.ts             # POST: Submit contact form
│   ├── newsletter/
│   │   └── route.ts             # POST: Subscribe to newsletter
│   ├── projects/
│   │   ├── route.ts             # GET: List projects
│   │   └── [id]/
│   │       └── route.ts         # GET/PUT/DELETE single project
│   ├── services/
│   │   └── route.ts             # GET/POST/PUT/DELETE services
│   ├── testimonials/
│   │   └── route.ts             # GET/POST/PUT/DELETE
│   ├── upload/
│   │   └── route.ts             # POST: Image upload
│   └── settings/
│       └── route.ts             # GET/PUT site settings
│
├── login/
│   └── page.tsx                 # Admin login page
│
├── not-found.tsx                # Custom 404 page
├── error.tsx                    # Custom error boundary
├── loading.tsx                  # Global loading UI
├── globals.css
├── layout.tsx                   # Root layout (providers, fonts)
├── sitemap.ts                   # Dynamic sitemap generator
├── robots.ts                    # robots.txt generator
└── manifest.ts                  # PWA manifest
```

---

## 6. Backend API Routes

### 6.1 Contact Form Submission

```typescript
// app/api/contact/route.ts
import { db } from "@/lib/db"
import { Resend } from "resend"
import { z } from "zod"
import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10).max(2000),
})

export async function POST(req: Request) {
  // Rate limiting: 5 requests per IP per 15 minutes
  const limiter = await rateLimit(req)
  if (!limiter.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const body = await req.json()
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // Save to database
  const submission = await db.contactSubmission.create({
    data: parsed.data,
  })

  // Send notification email to admin
  await resend.emails.send({
    from: "Mimaar Website <noreply@mimaarassociate.com>",
    to:   "mimaarassociates@gmail.com",
    subject: `New Contact: ${parsed.data.name} — ${parsed.data.service || "General"}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${parsed.data.name}</p>
      <p><strong>Email:</strong> ${parsed.data.email}</p>
      <p><strong>Phone:</strong> ${parsed.data.phone || "N/A"}</p>
      <p><strong>Service:</strong> ${parsed.data.service || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${parsed.data.message}</p>
    `,
  })

  // Send confirmation email to user
  await resend.emails.send({
    from: "Mimaar Associates <noreply@mimaarassociate.com>",
    to:   parsed.data.email,
    subject: "Thank you for contacting Mimaar Associates",
    html: `
      <h2>Thank you, ${parsed.data.name}!</h2>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p>— Mimaar Associates Team</p>
    `,
  })

  return NextResponse.json({ success: true, id: submission.id })
}
```

### 6.2 Newsletter Subscription

```typescript
// app/api/newsletter/route.ts
export async function POST(req: Request) {
  const { email } = await req.json()
  // Validate, check duplicates, save to db.subscriber
  // Send welcome email via Resend
}
```

### 6.3 Projects CRUD (Admin-only)

```typescript
// app/api/projects/route.ts
// GET  → list all projects (public, filtered by isActive)
// POST → create project (auth required)

// app/api/projects/[id]/route.ts
// GET    → single project by ID/slug
// PUT    → update project (auth required)
// DELETE → soft-delete / deactivate (auth required)
```

### 6.4 Rate Limiting Utility

```typescript
// lib/rate-limit.ts
import { LRUCache } from "lru-cache"

const rateLimit = (options?: { interval?: number; uniqueTokenPerInterval?: number }) => {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) tokenCache.set(token, tokenCount)
        tokenCount[0] += 1
        const currentUsage = tokenCount[0]
        if (currentUsage > limit) reject()
        else resolve()
      }),
  }
}
```

---

## 7. Admin Dashboard

### 7.1 Dashboard Overview Page
- **Stats cards:** Total projects, new contacts (this week), subscribers, page views
- **Recent contacts table:** Last 5 submissions with status badges
- **Quick actions:** Add project, view messages, update settings
- **Mini chart:** Contact form submissions over last 30 days (using recharts — already installed)

### 7.2 Projects Management
- **Data table** with columns: Image thumbnail, Title, Category, Status, Date, Actions
- **Inline status toggle** (Active/Inactive)
- **Rich text editor** for project content (use `@tiptap/react` or a simple markdown editor)
- **Drag-and-drop image reordering** for project galleries
- **Bulk actions:** Delete, activate, deactivate

### 7.3 Contact Submissions
- **Table view** with status filter tabs (New / Read / Responded / Archived)
- **Click to expand** submission details
- **Status update** dropdown
- **Internal notes** field for admin tracking
- **Export to CSV** functionality

### 7.4 UI Components Used
Leverage the already-installed shadcn/ui components:
- `Table` for data listings
- `Dialog` for confirmations
- `Sheet` for mobile sidebar
- `Tabs` for status filters
- `Toast` (sonner) for action feedback
- `Form` + `Input` + `Textarea` for CRUD forms
- `Badge` for status indicators
- `Skeleton` for loading states
- `Dropdown Menu` for row actions
- `Sidebar` for admin navigation

---

## 8. Authentication

### 8.1 NextAuth.js v5 Setup

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

```typescript
// auth.ts (root)
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        return valid ? user : null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
})
```

### 8.2 Admin Route Protection (Middleware)

```typescript
// middleware.ts
import { auth } from "./auth"

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isApiAdminRoute = req.nextUrl.pathname.startsWith("/api/admin")

  if ((isAdminRoute || isApiAdminRoute) && !req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
```

---

## 9. File Uploads & Media Management

### Option A: UploadThing (Recommended — easiest with Next.js)

```bash
npm install uploadthing @uploadthing/react
```

- Free tier: 2GB storage, 2GB bandwidth/month
- Handles image resizing, CDN, and signed URLs
- Direct integration with Next.js App Router

### Option B: Cloudinary (More features, higher limits)

```bash
npm install cloudinary next-cloudinary
```

- Free tier: 25GB storage, 25GB bandwidth/month
- Image transformations (resize, crop, optimize) on the fly
- Video support

### Upload Flow
1. Admin selects images in the project form
2. Frontend sends files to `/api/upload`
3. Files are uploaded to UploadThing/Cloudinary
4. Returned URLs are saved in the `ProjectImage` table

---

## 10. SEO & Performance

### 10.1 Dynamic Metadata

```typescript
// app/(public)/projects/[slug]/page.tsx
import { Metadata } from "next"
import { db } from "@/lib/db"

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await db.project.findUnique({ where: { slug: params.slug } })
  return {
    title: `${project.title} | Mimaar Associates`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.images.map(img => img.url),
    },
  }
}
```

### 10.2 Auto-generated Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await db.project.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  return [
    { url: "https://mimaarassociate.com", lastModified: new Date(), priority: 1.0 },
    { url: "https://mimaarassociate.com/services", priority: 0.9 },
    { url: "https://mimaarassociate.com/projects", priority: 0.9 },
    { url: "https://mimaarassociate.com/about", priority: 0.7 },
    { url: "https://mimaarassociate.com/contact", priority: 0.8 },
    ...projects.map((p) => ({
      url: `https://mimaarassociate.com/projects/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.6,
    })),
  ]
}
```

### 10.3 Performance Checklist

| Optimization | Implementation |
|---|---|
| Image optimization | `next/image` with `sizes`, `priority` for above-fold |
| Font loading | `next/font` (local or Google) with `display: swap` |
| Code splitting | Dynamic imports for heavy components (map, charts) |
| Static generation | ISR for project pages (`revalidate: 3600`) |
| Bundle analysis | `@next/bundle-analyzer` for monitoring |
| Security headers | `next.config.mjs` headers config |
| Compression | Vercel auto-gzip/brotli, or manual with `compression` |

### 10.4 Security Headers

```javascript
// next.config.mjs
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]
```

---

## 11. Deployment & Infrastructure

### 11.1 Vercel (Recommended — zero-config for Next.js)

```
GitHub Repo → Vercel Auto Deploy
├── Production:  main branch  → mimaarassociate.com
├── Preview:     PR branches  → preview-*.vercel.app
└── Environment: Variables configured in Vercel dashboard
```

### 11.2 Database Hosting — Neon PostgreSQL

- **Free tier:** 0.5 GB storage, 190 hours compute/month
- **Serverless driver** for edge compatibility
- **Branching** for preview deployments

### 11.3 Domain & DNS

- **Domain:** `mimaarassociate.com`
- **DNS:** Vercel nameservers or Cloudflare (for extra CDN + DDoS protection)
- **SSL:** Auto-provisioned by Vercel

---

## 12. Environment Variables

```env
# .env.local

# ── Database ──────────────────────────
DATABASE_URL="postgresql://user:pass@host:5432/mimaar?sslmode=require"

# ── Authentication ────────────────────
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# ── Email (Resend) ────────────────────
RESEND_API_KEY="re_xxxxxxxxxxxx"

# ── File Uploads (UploadThing) ────────
UPLOADTHING_SECRET="sk_live_xxxxxxxxxxxx"
UPLOADTHING_APP_ID="your-app-id"

# ── Google Maps ───────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_KEY="AIzaxxxxxxxxxx"

# ── Analytics ─────────────────────────
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # optional, Vercel Analytics already exists
```

---

## 13. Phase-wise Execution Plan

### Phase 1 — Foundation & Backend (Week 1–2)
- [ ] Set up PostgreSQL database (Neon)
- [ ] Initialize Prisma, create schema, run migrations
- [ ] Create database seed script (admin user, initial services, sample projects)
- [ ] Build `lib/db.ts` client singleton
- [ ] Set up NextAuth.js v5 with credentials provider
- [ ] Build admin login page
- [ ] Create middleware for route protection
- [ ] Build all API route handlers (contact, newsletter, projects CRUD, services CRUD, testimonials CRUD)
- [ ] Set up Resend for transactional emails
- [ ] Set up UploadThing for image uploads
- [ ] Create rate limiting utility
- [ ] Add Zod validation schemas for all API inputs

### Phase 2 — Frontend Redesign & Animations (Week 2–3)
- [ ] Update color palette in `globals.css` (Navy + Gold theme)
- [ ] Set up Plus Jakarta Sans + Playfair Display fonts
- [ ] Wire up `ThemeProvider` in root layout (dark mode toggle)
- [ ] Build animation wrapper components (`FadeIn`, `SlideIn`, `StaggerChildren`, `CountUp`, `ParallaxImage`, `TextReveal`)
- [ ] Redesign Hero Section (full-viewport, animated text reveal, glassmorphism stat cards, scroll indicator)
- [ ] Redesign Header (shrink on scroll, active section highlight, animated mobile menu)
- [ ] Redesign Services Section (3D tilt cards, staggered entrance, icon animations)
- [ ] Redesign Projects Section (bento grid, hover effects, category filter tabs, lightbox)
- [ ] Redesign About Section (parallax image, animated counters, optional timeline)
- [ ] Build Testimonials Section (carousel, star ratings, auto-scroll)
- [ ] Redesign Contact Section (connect form to API, add validation, add map embed, submission animations)
- [ ] Redesign Footer (gradient border, social icons, back-to-top, connect newsletter form)
- [ ] Add global effects (custom scrollbar, selection color, smooth scrolling)
- [ ] Build custom loading / skeleton states
- [ ] Build custom 404 and error pages

### Phase 3 — Admin Dashboard (Week 3–4)
- [ ] Build admin layout (sidebar navigation, topbar with user info)
- [ ] Build dashboard overview page (stats, recent contacts, charts)
- [ ] Build projects management (data table, create form, edit form, image upload)
- [ ] Build services management (reorder, edit inline)
- [ ] Build contacts management (table, status filters, notes, CSV export)
- [ ] Build testimonials management (CRUD)
- [ ] Build subscribers list view
- [ ] Build site settings page

### Phase 4 — Public Subpages (Week 4–5)
- [ ] Build `/services` detail page (full service descriptions, CTA)
- [ ] Build `/projects` gallery page (filter by category, search, pagination)
- [ ] Build `/projects/[slug]` detail page (image gallery, description, related projects)
- [ ] Build `/about` full page (team, history timeline, mission/vision)
- [ ] Build `/contact` standalone page (larger map, full form, FAQ accordion)

### Phase 5 — SEO, Performance & Polish (Week 5–6)
- [ ] Implement dynamic metadata for all pages
- [ ] Build sitemap.ts and robots.ts
- [ ] Add structured data (JSON-LD) for local business, services
- [ ] Convert all `<img>` to `next/image` with proper sizes
- [ ] Add `loading="lazy"` and `priority` attributes appropriately
- [ ] Add security headers to `next.config.mjs`
- [ ] Run Lighthouse audit — target 90+ on all metrics
- [ ] Test responsive design across all breakpoints
- [ ] Test dark mode across all pages
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Set up Vercel deployment pipeline
- [ ] Configure custom domain (`mimaarassociate.com`)
- [ ] Final QA pass and go-live

---

## 14. New Dependencies to Install

```bash
# Backend
npm install prisma @prisma/client          # ORM + database
npm install next-auth@beta @auth/prisma-adapter  # Authentication
npm install bcryptjs                        # Password hashing
npm install resend                          # Email service
npm install uploadthing @uploadthing/react  # File uploads
npm install lru-cache                       # Rate limiting

# Frontend
npm install framer-motion                   # Animations
npm install @fontsource/plus-jakarta-sans @fontsource/playfair-display  # Fonts
npm install @next/bundle-analyzer           # Performance monitoring

# Dev
npm install -D @types/bcryptjs
```

---

## 15. Folder Structure (Final)

```
MimaarAssociates/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── services/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   ├── services/
│   │   ├── contacts/
│   │   ├── testimonials/
│   │   ├── subscribers/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── contact/route.ts
│   │   ├── newsletter/route.ts
│   │   ├── projects/route.ts
│   │   ├── services/route.ts
│   │   ├── testimonials/route.ts
│   │   ├── upload/route.ts
│   │   └── settings/route.ts
│   ├── login/page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── manifest.ts
├── components/
│   ├── animations/
│   │   ├── fade-in.tsx
│   │   ├── slide-in.tsx
│   │   ├── stagger-children.tsx
│   │   ├── count-up.tsx
│   │   ├── parallax-image.tsx
│   │   ├── text-reveal.tsx
│   │   └── page-transition.tsx
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── services-section.tsx
│   │   ├── about-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── contact-section.tsx
│   │   ├── footer.tsx
│   │   └── header.tsx
│   ├── admin/
│   │   ├── admin-sidebar.tsx
│   │   ├── admin-topbar.tsx
│   │   ├── data-table.tsx
│   │   ├── stats-card.tsx
│   │   └── image-upload.tsx
│   ├── shared/
│   │   ├── back-to-top.tsx
│   │   ├── dark-mode-toggle.tsx
│   │   ├── loading-spinner.tsx
│   │   └── section-heading.tsx
│   ├── theme-provider.tsx
│   └── ui/                    # shadcn/ui (existing 50 components)
├── hooks/
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   ├── use-scroll-progress.ts
│   └── use-intersection.ts
├── lib/
│   ├── db.ts                  # Prisma client singleton
│   ├── utils.ts               # Existing
│   ├── auth.ts                # Auth helpers
│   ├── rate-limit.ts          # Rate limiting
│   ├── validations.ts         # Zod schemas
│   └── email-templates.ts     # Resend HTML templates
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── images/                # Organized image assets
│   ├── fonts/                 # Local font files (if not using npm)
│   └── favicon.ico
├── styles/
│   └── globals.css            # Existing (may merge with app/globals.css)
├── auth.ts                    # NextAuth.js root config
├── middleware.ts               # Route protection
├── next.config.mjs
├── package.json
├── tsconfig.json
├── .env.local                 # Environment variables (gitignored)
├── .env.example               # Template for env vars
└── Project.MD                 # This file
```

---

## 🎯 Success Criteria

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.0s |
| Mobile responsive | All breakpoints |
| Dark mode | Fully functional |
| Contact form | End-to-end working |
| Admin CRUD | All entities manageable |
| Image uploads | Working with CDN |
| Email notifications | Working via Resend |

---

> **Ready to build.** Start with `Phase 1` — once the backend foundation is solid, everything else plugs in cleanly.
