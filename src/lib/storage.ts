import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Service,
  type InsertService,
  type Sale,
  type InsertSale,
  type SaleItem,
  type InsertSaleItem,
  UserRoleEnum,
} from "@shared/schema";
import { prisma } from "./db";

export interface IStorage {
  // Users
  getUsers(): Promise<any[]>;
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(data: any): Promise<any>;
  updateUser(id: string, data: any): Promise<any | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<any[]>;
  getProduct(id: string): Promise<any | undefined>;
  getLowStockProducts(): Promise<any[]>;
  createProduct(data: any): Promise<any>;
  updateProduct(id: string, data: any): Promise<any | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Services
  getServices(): Promise<any[]>;
  getService(id: string): Promise<any | undefined>;
  createService(data: any): Promise<any>;
  updateService(id: string, data: any): Promise<any | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Sales
  getSales(): Promise<any[]>;
  getSale(id: string): Promise<any | undefined>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<any[]>;
  createSale(data: any): Promise<any>;
  updateSale(id: string, data: any): Promise<any | undefined>;

  // Sale Items
  getSaleItems(saleId: string): Promise<any[]>;
  createSaleItem(data: any): Promise<any>;

  // Dashboard
  getDashboardStats(): Promise<any>;

  // Reports
  getSalesReport(period: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getUser(id: string) {
    return prisma.user.findUnique({ where: { id } }) || undefined;
  }

  async getUserByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } }) || undefined;
  }

  async createUser(data: any) {
    return prisma.user.create({ data });
  }

  async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    await prisma.user.delete({ where: { id } });
    return true;
  }

  // Products
  async getProducts() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getProduct(id: string) {
    return prisma.product.findUnique({ where: { id } }) || undefined;
  }

  async getLowStockProducts() {
    // raw query syntax simulation or advanced findMany
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      }
    });
    return products.filter(p => p.stockQuantity <= p.lowStockThreshold);
  }

  async createProduct(data: any) {
    return prisma.product.create({ data });
  }

  async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    return true;
  }

  // Services
  async getServices() {
    return prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getService(id: string) {
    return prisma.service.findUnique({ where: { id } }) || undefined;
  }

  async createService(data: any) {
    return prisma.service.create({ data });
  }

  async updateService(id: string, data: any) {
    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async deleteService(id: string) {
    await prisma.service.delete({ where: { id } });
    return true;
  }

  // Sales
  async getSales() {
    return prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getSale(id: string) {
    return prisma.sale.findUnique({ where: { id } }) || undefined;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date) {
    return prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createSale(data: any) {
    return prisma.sale.create({ data });
  }

  async updateSale(id: string, data: any) {
    return prisma.sale.update({
      where: { id },
      data,
    });
  }

  // Sale Items
  async getSaleItems(saleId: string) {
    return prisma.saleItem.findMany({
      where: { saleId },
    });
  }

  async createSaleItem(data: any) {
    return prisma.saleItem.create({ data });
  }

  // Dashboard
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySalesData = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todaySales = todaySalesData.length;
    const todayRevenue = todaySalesData.reduce(
      (sum: number, s: any) => sum + Number(s.total),
      0
    );

    const totalProducts = await prisma.product.count();
    const totalServices = await prisma.service.count();

    const lowStockCount = (await this.getLowStockProducts()).length;

    const recentSales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const weeklySalesData = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

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
        .filter((s: any) => {
          const saleDate = new Date(s.createdAt);
          return saleDate >= dayStart && saleDate <= dayEnd;
        })
        .reduce((sum: number, s: any) => sum + Number(s.total), 0);

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

    const salesData = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      }
    });

    const totalSales = salesData.length;
    const totalRevenue = salesData.reduce(
      (sum: number, s: any) => sum + Number(s.total),
      0
    );
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    const allSaleItems = salesData.flatMap(s => s.items);

    // Sales by day
    const salesByDayMap = new Map<string, { total: number; count: number }>();
    for (const sale of salesData) {
      const date = new Date(sale.createdAt).toLocaleDateString("en-US", {
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

    // Sales by category
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
