# SiliconPOS - API Design Document

> **Base URL**: `/api`
> **Format**: JSON (`application/json`)
> **Authentication**: Cookie/Session-based via custom auth or JWT. Protected routes require valid sessions and RBAC checks.

---

## 1. Authentication & Session (`/api/[auth|login|register|logout]`)
- **POST `/api/login`**: Authenticates a user.
  - Body: `{ username, password }`
  - Returns: `{ success: true, user: UserObject }`
- **POST `/api/register`**: Registers a new staff member (Admin/Manager only).
  - Body: `InsertUser` schema
- **POST `/api/logout`**: Destroys the current session.
- **GET `/api/auth/me`**: Returns the current authenticated user's profile and settings.

## 2. Dashboard Analytics (`/api/dashboard`)
- **GET `/api/dashboard/summary`**: Fetch high-level stats (Total Sales, Revenue, Low Stock Count, Active Staff).
- **GET `/api/dashboard/charts`**: Fetch time-series data for Recharts (e.g., Weekly Revenue).

## 3. Products Management (`/api/products`)
- **GET `/api/products`**: Fetch all products. Includes query params for filtering (`?category=`, `?search=`).
- **GET `/api/products/:id`**: Fetch a single product by UUID.
- **POST `/api/products`**: Create a new product. (Requires `InsertProduct` schema).
- **PUT `/api/products/:id`**: Update existing product details or stock quantity.
- **DELETE `/api/products/:id`**: Soft-delete or archive a product. (Admin/Manager only).

## 4. Services Management (`/api/services`)
- **GET `/api/services`**: Fetch all billable services.
- **POST `/api/services`**: Create a new service offering (Requires `InsertService` schema).
- **PUT `/api/services/:id`**: Update a service.
- **DELETE `/api/services/:id`**: Archiving a service.

## 5. Sales & POS (`/api/sales`)
- **GET `/api/sales`**: Fetch transaction history with pagination and date-range filters.
- **GET `/api/sales/:id`**: Fetch deep details of a specific sale, including `SaleItems`, linked `staffUser`, and `customerName`.
- **POST `/api/sales`**: Process a new checkout/transaction.
  - Body: `InsertSale` + Array of `InsertSaleItem` payloads.
  - Sub-action: Deducts stock from `Product` tables automatically via Prisma transaction.
- **PUT `/api/sales/:id/status`**: Update the status of a sale (`pending`, `completed`, `cancelled`).

## 6. Staff & User Management (`/api/staff`)
- **GET `/api/staff`**: List all system users (Admin only).
- **POST `/api/staff`**: Create a new user account contextually.
- **PUT `/api/staff/:id/role`**: Promote or demote user roles.
- **PUT `/api/staff/:id/status`**: Toggle `isActive` status (suspend accounts).

## 7. Notifications (`/api/notifications`)
- **GET `/api/notifications`**: Fetch unread/read notifications for the current user.
- **PUT `/api/notifications/:id/read`**: Mark specific notification as read.
- **PUT `/api/notifications/read-all`**: Mark all as read.

## 8. Settings (`/api/settings`)
- **GET `/api/settings`**: Fetch application/user preferences.
- **PUT `/api/settings`**: Update user preferences (`theme`, `emailNotifications`, `pushNotifications`).

## 9. Reports (`/api/reports`)
- **GET `/api/reports/sales`**: Generate detailed CSV/JSON export data based on robust filters.
- **GET `/api/reports/inventory`**: Generate low-stock or valuation reports.

---
### Standard Error Responses
```json
{
  "error": "Unauthorized",
  "code": "AUTH_001",
  "details": { "message": "Invalid credentials or missing token." }
}
```
*Validation errors will return HTTP 400 with a map of Zod validation failures in the `details` object.*
