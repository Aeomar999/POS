# SiliconPOS - Technology Stack

## 1. Core Framework & Language
- **Framework**: [Next.js v16.1.6](https://nextjs.org/) (App Router)
- **Library**: [React v19](https://react.dev/)
- **Language**: [TypeScript v5.6](https://www.typescriptlang.org/) (Strict Mode Enabled)
- **Environment**: Node.js v20+

## 2. Database & ORM
- **Database**: PostgreSQL
- **ORM**: [Prisma v7.4.1](https://www.prisma.io/)
- **Adapter**: `@prisma/adapter-pg` & `pg` native driver
- **Schema Validation**: `zod` for strict runtime types & payload validation

## 3. Styling & UI Components
- **CSS Framework**: [Tailwind CSS v3.4](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/) Primitives & Shadcn UI architecture
- **Icons**: `lucide-react`, `react-icons`
- **Animations**: `framer-motion`, `tailwindcss-animate`
- **Utility**: `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
- **Theming**: `next-themes` (Dark/Light mode support)

## 4. State Management & Data Fetching
- **Server State**: `@tanstack/react-query` v5
- **Forms**: `react-hook-form` integrated with `@hookform/resolvers/zod`
- **Local State**: React Hooks (`useState`, `useReducer`, `useContext`)

## 5. Authentication & Security
- **Password Hashing**: `bcryptjs`
- **Token/Session**: `jose` (JWT) & Database-backed session store
- **Role-Based Access Control (RBAC)**: Enforced via Prisma enums (`admin`, `manager`, `sales`)

## 6. Utilities & Charting
- **Date Manipulation**: `date-fns`
- **Data Visualization**: `recharts` for dashboard analytics
- **Carousels/Sliders**: `embla-carousel-react`
- **OTP Inputs**: `input-otp`

## 7. Development Tools
- **Linting**: ESLint (via Next.js)
- **Execution Engine**: `tsx` (TypeScript Execute)
- **Typography plugin**: `@tailwindcss/typography`
