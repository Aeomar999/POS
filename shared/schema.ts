import { z } from "zod";

// Enums
export const UserRoleEnum = z.enum(["admin", "manager", "sales"]);
export const CategoryEnum = z.enum(["networking", "cctv", "intercom", "services"]);
export const SaleStatusEnum = z.enum(["pending", "completed", "cancelled"]);

// Types
export type UserRole = z.infer<typeof UserRoleEnum>;
export type Category = z.infer<typeof CategoryEnum>;
export type SaleStatus = z.infer<typeof SaleStatusEnum>;

// We use string or number for Decimal fields to be flexible with JSON payloads
const decimalSchema = z.union([z.string(), z.number()]);

// User Schema
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  password: z.string().min(6), // We'll hash this on the server
  name: z.string().min(1),
  role: UserRoleEnum.default("sales"),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// UserSettings Schema
export const userSettingsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertUserSettingsSchema = userSettingsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

// Notification Schema
export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  isRead: z.boolean().default(false),
  link: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const insertNotificationSchema = notificationSchema.omit({
  id: true,
  createdAt: true,
});

export type Notification = z.infer<typeof notificationSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Product
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  category: CategoryEnum,
  price: decimalSchema,
  costPrice: decimalSchema.nullable().optional(),
  stockQuantity: z.number().default(0),
  lowStockThreshold: z.number().default(10),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Service
export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: CategoryEnum.default("services"),
  price: decimalSchema,
  duration: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertServiceSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Service = z.infer<typeof serviceSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;

// Sale
export const saleSchema = z.object({
  id: z.string().uuid(),
  saleNumber: z.string(),
  staffUserId: z.string().uuid(),
  customerName: z.string().nullable().optional(),
  customerPhone: z.string().nullable().optional(),
  subtotal: decimalSchema,
  tax: decimalSchema.default(0),
  discount: decimalSchema.default(0),
  total: decimalSchema,
  status: SaleStatusEnum.default("completed"),
  notes: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const insertSaleSchema = saleSchema.omit({
  id: true,
  createdAt: true,
});

export type Sale = z.infer<typeof saleSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;

// Sale Items
export const saleItemSchema = z.object({
  id: z.string().uuid(),
  saleId: z.string().uuid(),
  productId: z.string().uuid().nullable().optional(),
  serviceId: z.string().uuid().nullable().optional(),
  name: z.string(),
  quantity: z.number(),
  unitPrice: decimalSchema,
  total: decimalSchema,
});

export const insertSaleItemSchema = saleItemSchema.omit({
  id: true,
});

export type SaleItem = z.infer<typeof saleItemSchema>;
export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;
