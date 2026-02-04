import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";
import { insertProductSchema, insertServiceSchema, insertStaffUserSchema, insertSaleSchema, insertSaleItemSchema } from "@shared/schema";
import { z } from "zod";

function generateSaleNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SL-${dateStr}-${randomStr}`;
}

// Role-based access control middleware
const requireRole = (...allowedRoles: string[]): RequestHandler => {
  return async (req: any, res, next) => {
    try {
      const authUserId = req.user?.claims?.sub;
      if (!authUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const staffUser = await storage.getStaffUserByAuthId(authUserId);
      if (!staffUser) {
        return res.status(403).json({ message: "Staff user not found" });
      }

      if (!staffUser.isActive) {
        return res.status(403).json({ message: "Account is inactive" });
      }

      if (!allowedRoles.includes(staffUser.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      req.staffUser = staffUser;
      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Authorization error" });
    }
  };
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup auth before other routes
  await setupAuth(app);
  registerAuthRoutes(app);

  // Get current staff user
  app.get("/api/staff/me", isAuthenticated, async (req: any, res) => {
    try {
      const authUserId = req.user?.claims?.sub;
      if (!authUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let staffUser = await storage.getStaffUserByAuthId(authUserId);

      // Auto-create staff user if not exists (first user becomes admin)
      if (!staffUser) {
        const allStaff = await storage.getStaffUsers();
        const isFirstUser = allStaff.length === 0;

        staffUser = await storage.createStaffUser({
          authUserId,
          name: `${req.user.claims.first_name || ""} ${req.user.claims.last_name || ""}`.trim() || "User",
          email: req.user.claims.email || `user-${authUserId.slice(0, 8)}@temp.com`,
          role: isFirstUser ? "admin" : "sales",
          isActive: true,
        });
      }

      res.json(staffUser);
    } catch (error) {
      console.error("Error fetching staff user:", error);
      res.status(500).json({ message: "Failed to fetch staff user" });
    }
  });

  // Staff Management (Admin only)
  app.get("/api/staff", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const staff = await storage.getStaffUsers();
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const data = insertStaffUserSchema.parse({
        ...req.body,
        authUserId: req.body.authUserId || `manual-${Date.now()}`,
      });
      const staff = await storage.createStaffUser(data);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error creating staff:", error);
      res.status(500).json({ message: "Failed to create staff" });
    }
  });

  app.patch("/api/staff/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const updateData = insertStaffUserSchema.partial().parse(req.body);
      const staff = await storage.updateStaffUser(req.params.id, updateData);
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      res.json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error updating staff:", error);
      res.status(500).json({ message: "Failed to update staff" });
    }
  });

  app.delete("/api/staff/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      await storage.deleteStaffUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting staff:", error);
      res.status(500).json({ message: "Failed to delete staff" });
    }
  });

  // Products (Read: all authenticated, Write: admin/manager)
  app.get("/api/products", isAuthenticated, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/low-stock", isAuthenticated, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      const updateData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, updateData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Services (Read: all authenticated, Write: admin/manager)
  app.get("/api/services", isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post("/api/services", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.patch("/api/services/:id", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      const updateData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, updateData);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Sales
  app.get("/api/sales", isAuthenticated, async (req, res) => {
    try {
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  app.post("/api/sales", isAuthenticated, async (req: any, res) => {
    try {
      const authUserId = req.user?.claims?.sub;
      const staffUser = await storage.getStaffUserByAuthId(authUserId);

      if (!staffUser) {
        return res.status(403).json({ message: "Staff user not found" });
      }

      const { items, customerName, customerPhone, discount } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Cart items required" });
      }

      // Calculate totals
      let subtotal = 0;
      for (const item of items) {
        subtotal += item.unitPrice * item.quantity;
      }

      const discountAmount = discount || 0;
      const total = subtotal - discountAmount;

      // Create sale
      const sale = await storage.createSale({
        saleNumber: generateSaleNumber(),
        staffUserId: staffUser.id,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        subtotal: subtotal.toString(),
        tax: "0",
        discount: discountAmount.toString(),
        total: total.toString(),
        status: "completed",
        notes: null,
      });

      // Create sale items and update stock
      for (const item of items) {
        await storage.createSaleItem({
          saleId: sale.id,
          productId: item.productId || null,
          serviceId: item.serviceId || null,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          total: (item.unitPrice * item.quantity).toString(),
        });

        // Update product stock if it's a product
        if (item.productId) {
          const product = await storage.getProduct(item.productId);
          if (product) {
            await storage.updateProduct(item.productId, {
              stockQuantity: Math.max(0, product.stockQuantity - item.quantity),
            });
          }
        }
      }

      res.status(201).json(sale);
    } catch (error) {
      console.error("Error creating sale:", error);
      res.status(500).json({ message: "Failed to create sale" });
    }
  });

  // Dashboard
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Reports (Admin/Manager only)
  app.get("/api/reports/sales", isAuthenticated, requireRole("admin", "manager"), async (req, res) => {
    try {
      const period = (req.query.period as string) || "week";
      const report = await storage.getSalesReport(period);
      res.json(report);
    } catch (error) {
      console.error("Error fetching sales report:", error);
      res.status(500).json({ message: "Failed to fetch sales report" });
    }
  });

  return httpServer;
}
