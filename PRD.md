# Product Requirements Document (PRD)
**Product Name**: SiliconPOS
**Version**: 1.0.0

## 1. Product Overview
SiliconPOS is a modern, responsive, and robust Point of Sale (POS) and Inventory Management System designed explicitly for retail and service-oriented businesses (e.g., tech hardware, networking, CCTV, intercom providers). 
It unifies the checkout experience with backend inventory tracking, staff management, and rich analytics into a single cohesive Web App built on Next.js 16.

## 2. Target Audience
- Hardware retail stores
- IT Service & Installation Providers
- Store Managers tracking inventory and sales quotas
- Sales Representatives processing daily transactions

## 3. Core Functionality & Features (Current Scope)

### 3.1 Authentication & RBAC (Role-Based Access Control)
- **Roles**: Admin, Manager, Sales.
- **Features**: Secure login, session management, and role-based UI restrictions. Sales staff cannot view total margin reports, while Admins have full structural control.

### 3.2 Point of Sale (POS) System
- **Checkout Interface**: High-performance, keyboard-friendly UI to add products and services.
- **Cart Management**: Adjust quantities, apply line-item or cart-wide discounts, and calculate dynamic tax.
- **Customer Linking**: Optionally attach customer name and phone to a transaction for future CRM capabilities.
- **Receipt Generation**: Issue unique `saleNumber` and log transaction details deeply (`Sale` and `SaleItem` records).

### 3.3 Inventory Management
- **Hierarchical Products**: Managed categorized items (Networking, CCTV, Intercom).
- **Stock Tracking**: Real-time deduction upon completed sales.
- **Low Stock Alerts**: Configurable `lowStockThreshold` per product, triggering automatic system notifications. 
- **Cost vs. Retail**: Tracking both `costPrice` and `price` to automatically calculate margins (manager/admin view only).

### 3.4 Service Management
- **Billable Services**: Ability to sell labor/time alongside physical goods directly on the same ticket (e.g., "CCTV Installation - 4 Hours").

### 3.5 Dashboard & Analytics
- **Live Metrics**: Today's revenue, active transactions, and top-selling items.
- **Visual Charts**: Integrated Recharts for revenue trends over time.

### 3.6 Staff & Settings
- **User Management**: Admins can onboard new staff, suspend accounts, and reset passwords.
- **Personalization**: User-specific settings for Theme (Light/Dark/System) and notification preferences.

---

## 4. Suggestive & Innovative New Implementations (Future Scope)

To elevate SiliconPOS from a standard tool to a "God-Tier" product, the following innovative features are proposed:

### 4.1 "Offline-First" Resilience Architecture
- **Concept**: Retail environments experience unstable internet. Implement Service Workers and IndexedDB to cache the catalog.
- **Impact**: Sales reps can continue processing transactions offline. The system queues the sales payload and auto-syncs to the PostgreSQL database once the connection is restored. Let's ensure zero downtime.

### 4.2 AI-Powered Inventory Forecasting
- **Concept**: Integrate statistical models or LLM APIs to analyze historical sales data and seasonal trends.
- **Impact**: Instead of static `lowStockThresholds`, the system predicts when stock will run out based on velocity and suggest purchase orders autonomously.

### 4.3 Integrated CRM & Loyalty Program
- **Concept**: Evolve the simple `customerName` field into a robust Customer Model. 
- **Impact**: Track customer LTV (Lifetime Value), issue digital points/rewards, and send automated SMS reminders for annual maintenance (e.g., CCTV servicing).

### 4.4 Advanced Multi-Branch / Location Topology
- **Concept**: Modify the database schema to introduce the concept of `StoreLocation`.
- **Impact**: Enables business owners to scale to multiple physical shops, transfer stock between locations, and view comparative sales analytics.

### 4.5 Keyboard-First Power UX
- **Concept**: Implement global hotkeys (e.g., `Cmd+K` for global search, `Cmd+Enter` for checkout). 
- **Impact**: Reduces time-to-checkout substantially, giving the software a "pro-tool" feel.

### 4.6 Dynamic Receipt Generation & Thermal Printing API
- **Concept**: Direct integration with standard ESC/POS thermal printers via WebUSB or WebBluetooth APIs.
- **Impact**: Avoids clunky browser PDF print dialogs, sending raw bytes directly to the receipt printer for instantaneous prints.
