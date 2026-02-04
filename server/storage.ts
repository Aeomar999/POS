import {
  staffUsers,
  products,
  services,
  sales,
  saleItems,
  type StaffUser,
  type InsertStaffUser,
  type Product,
  type InsertProduct,
  type Service,
  type InsertService,
  type Sale,
  type InsertSale,
  type SaleItem,
  type InsertSaleItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Staff Users
  getStaffUsers(): Promise<StaffUser[]>;
  getStaffUser(id: string): Promise<StaffUser | undefined>;
  getStaffUserByAuthId(authUserId: string): Promise<StaffUser | undefined>;
  getStaffUserByEmail(email: string): Promise<StaffUser | undefined>;
  createStaffUser(data: InsertStaffUser): Promise<StaffUser>;
  updateStaffUser(id: string, data: Partial<InsertStaffUser>): Promise<StaffUser | undefined>;
  deleteStaffUser(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getLowStockProducts(): Promise<Product[]>;
  createProduct(data: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(data: InsertService): Promise<Service>;
  updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Sales
  getSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  createSale(data: InsertSale): Promise<Sale>;
  updateSale(id: string, data: Partial<InsertSale>): Promise<Sale | undefined>;

  // Sale Items
  getSaleItems(saleId: string): Promise<SaleItem[]>;
  createSaleItem(data: InsertSaleItem): Promise<SaleItem>;

  // Dashboard
  getDashboardStats(): Promise<{
    todaySales: number;
    todayRevenue: number;
    totalProducts: number;
    totalServices: number;
    lowStockCount: number;
    recentSales: Sale[];
    weeklySales: { day: string; total: number }[];
  }>;

  // Reports
  getSalesReport(period: string): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesByDay: { date: string; total: number; count: number }[];
    salesByCategory: { category: string; total: number; count: number }[];
    topProducts: { name: string; quantity: number; revenue: number }[];
    recentSales: Sale[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // Staff Users
  async getStaffUsers(): Promise<StaffUser[]> {
    return db.select().from(staffUsers).orderBy(desc(staffUsers.createdAt));
  }

  async getStaffUser(id: string): Promise<StaffUser | undefined> {
    const [user] = await db.select().from(staffUsers).where(eq(staffUsers.id, id));
    return user;
  }

  async getStaffUserByAuthId(authUserId: string): Promise<StaffUser | undefined> {
    const [user] = await db.select().from(staffUsers).where(eq(staffUsers.authUserId, authUserId));
    return user;
  }

  async getStaffUserByEmail(email: string): Promise<StaffUser | undefined> {
    const [user] = await db.select().from(staffUsers).where(eq(staffUsers.email, email));
    return user;
  }

  async createStaffUser(data: InsertStaffUser): Promise<StaffUser> {
    const [user] = await db.insert(staffUsers).values(data).returning();
    return user;
  }

  async updateStaffUser(id: string, data: Partial<InsertStaffUser>): Promise<StaffUser | undefined> {
    const [user] = await db
      .update(staffUsers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(staffUsers.id, id))
      .returning();
    return user;
  }

  async deleteStaffUser(id: string): Promise<boolean> {
    const result = await db.delete(staffUsers).where(eq(staffUsers.id, id));
    return true;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.stockQuantity} <= ${products.lowStockThreshold}`
        )
      );
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(desc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(data: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(data).returning();
    return service;
  }

  async updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return db.select().from(sales).orderBy(desc(sales.createdAt));
  }

  async getSale(id: string): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return db
      .select()
      .from(sales)
      .where(and(gte(sales.createdAt, startDate), lte(sales.createdAt, endDate)))
      .orderBy(desc(sales.createdAt));
  }

  async createSale(data: InsertSale): Promise<Sale> {
    const [sale] = await db.insert(sales).values(data).returning();
    return sale;
  }

  async updateSale(id: string, data: Partial<InsertSale>): Promise<Sale | undefined> {
    const [sale] = await db.update(sales).set(data).where(eq(sales.id, id)).returning();
    return sale;
  }

  // Sale Items
  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    return db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
  }

  async createSaleItem(data: InsertSaleItem): Promise<SaleItem> {
    const [item] = await db.insert(saleItems).values(data).returning();
    return item;
  }

  // Dashboard
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's sales
    const todaySalesData = await db
      .select()
      .from(sales)
      .where(and(gte(sales.createdAt, today), lte(sales.createdAt, tomorrow)));

    const todaySales = todaySalesData.length;
    const todayRevenue = todaySalesData.reduce(
      (sum, s) => sum + Number(s.total),
      0
    );

    // Get total products
    const productsData = await db.select().from(products);
    const totalProducts = productsData.length;

    // Get total services
    const servicesData = await db.select().from(services);
    const totalServices = servicesData.length;

    // Get low stock count
    const lowStock = await this.getLowStockProducts();
    const lowStockCount = lowStock.length;

    // Get recent sales
    const recentSales = await db
      .select()
      .from(sales)
      .orderBy(desc(sales.createdAt))
      .limit(5);

    // Get weekly sales
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const weeklySalesData = await db
      .select()
      .from(sales)
      .where(gte(sales.createdAt, weekStart));

    const weeklySales: { day: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTotal = weeklySalesData
        .filter((s) => {
          const saleDate = new Date(s.createdAt!);
          return saleDate >= dayStart && saleDate <= dayEnd;
        })
        .reduce((sum, s) => sum + Number(s.total), 0);

      weeklySales.push({ day: dayName, total: dayTotal });
    }

    return {
      todaySales,
      todayRevenue,
      totalProducts,
      totalServices,
      lowStockCount,
      recentSales,
      weeklySales,
    };
  }

  // Reports
  async getSalesReport(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
    }

    const salesData = await db
      .select()
      .from(sales)
      .where(gte(sales.createdAt, startDate))
      .orderBy(desc(sales.createdAt));

    const totalSales = salesData.length;
    const totalRevenue = salesData.reduce(
      (sum, s) => sum + Number(s.total),
      0
    );
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Get all sale items for the period
    const allSaleItems: SaleItem[] = [];
    for (const sale of salesData) {
      const items = await this.getSaleItems(sale.id);
      allSaleItems.push(...items);
    }

    // Sales by day
    const salesByDayMap = new Map<string, { total: number; count: number }>();
    for (const sale of salesData) {
      const date = new Date(sale.createdAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const existing = salesByDayMap.get(date) || { total: 0, count: 0 };
      salesByDayMap.set(date, {
        total: existing.total + Number(sale.total),
        count: existing.count + 1,
      });
    }
    const salesByDay = Array.from(salesByDayMap.entries()).map(
      ([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
      })
    );

    // Sales by category (based on products in sale items)
    const salesByCategory: { category: string; total: number; count: number }[] = [
      { category: "networking", total: 0, count: 0 },
      { category: "cctv", total: 0, count: 0 },
      { category: "intercom", total: 0, count: 0 },
      { category: "services", total: 0, count: 0 },
    ];

    for (const item of allSaleItems) {
      if (item.productId) {
        const product = await this.getProduct(item.productId);
        if (product) {
          const cat = salesByCategory.find((c) => c.category === product.category);
          if (cat) {
            cat.total += Number(item.total);
            cat.count += item.quantity;
          }
        }
      } else if (item.serviceId) {
        const cat = salesByCategory.find((c) => c.category === "services");
        if (cat) {
          cat.total += Number(item.total);
          cat.count += item.quantity;
        }
      }
    }

    // Top products
    const productSales = new Map<string, { quantity: number; revenue: number }>();
    for (const item of allSaleItems) {
      const existing = productSales.get(item.name) || { quantity: 0, revenue: 0 };
      productSales.set(item.name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + Number(item.total),
      });
    }
    const topProducts = Array.from(productSales.entries())
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
      salesByDay,
      salesByCategory: salesByCategory.filter((c) => c.total > 0),
      topProducts,
      recentSales: salesData.slice(0, 20),
    };
  }
}

export const storage = new DatabaseStorage();
