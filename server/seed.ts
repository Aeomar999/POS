import { db } from "./db";
import { products, services, staffUsers } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with sample data...");

    // Seed Products
    const sampleProducts = [
      // Networking
      {
        name: "Cat6 Ethernet Cable 10m",
        description: "High-quality Cat6 ethernet cable for reliable network connections",
        sku: "NET-CAT6-10M",
        category: "networking" as const,
        price: "15.99",
        costPrice: "8.50",
        stockQuantity: 150,
        lowStockThreshold: 20,
        isActive: true,
      },
      {
        name: "TP-Link 8-Port Gigabit Switch",
        description: "Desktop network switch with 8 gigabit ports",
        sku: "NET-SW-8P",
        category: "networking" as const,
        price: "45.99",
        costPrice: "28.00",
        stockQuantity: 35,
        lowStockThreshold: 10,
        isActive: true,
      },
      {
        name: "Ubiquiti UniFi AP AC Pro",
        description: "Enterprise-grade indoor access point",
        sku: "NET-AP-PRO",
        category: "networking" as const,
        price: "189.99",
        costPrice: "120.00",
        stockQuantity: 15,
        lowStockThreshold: 5,
        isActive: true,
      },
      {
        name: "RJ45 Connectors Pack (100pcs)",
        description: "Gold-plated RJ45 connectors for Cat5e/Cat6",
        sku: "NET-RJ45-100",
        category: "networking" as const,
        price: "24.99",
        costPrice: "12.00",
        stockQuantity: 8,
        lowStockThreshold: 15,
        isActive: true,
      },
      {
        name: "Network Crimping Tool Kit",
        description: "Professional crimping tool with cable tester",
        sku: "NET-TOOL-KIT",
        category: "networking" as const,
        price: "65.99",
        costPrice: "35.00",
        stockQuantity: 25,
        lowStockThreshold: 8,
        isActive: true,
      },
      // CCTV
      {
        name: "Hikvision 4MP IP Dome Camera",
        description: "Indoor/outdoor dome camera with night vision",
        sku: "CCTV-DOM-4MP",
        category: "cctv" as const,
        price: "129.99",
        costPrice: "75.00",
        stockQuantity: 40,
        lowStockThreshold: 10,
        isActive: true,
      },
      {
        name: "8-Channel NVR Recorder",
        description: "Network video recorder with 2TB storage",
        sku: "CCTV-NVR-8CH",
        category: "cctv" as const,
        price: "349.99",
        costPrice: "220.00",
        stockQuantity: 12,
        lowStockThreshold: 5,
        isActive: true,
      },
      {
        name: "Bullet Camera 2MP Outdoor",
        description: "Weatherproof bullet camera with IR night vision",
        sku: "CCTV-BUL-2MP",
        category: "cctv" as const,
        price: "89.99",
        costPrice: "48.00",
        stockQuantity: 55,
        lowStockThreshold: 15,
        isActive: true,
      },
      {
        name: "POE Switch 4-Port",
        description: "Power over Ethernet switch for IP cameras",
        sku: "CCTV-POE-4P",
        category: "cctv" as const,
        price: "75.99",
        costPrice: "42.00",
        stockQuantity: 3,
        lowStockThreshold: 8,
        isActive: true,
      },
      // Intercom
      {
        name: "Video Door Phone Kit",
        description: "2-wire video intercom system with 7-inch monitor",
        sku: "INT-VDP-7",
        category: "intercom" as const,
        price: "199.99",
        costPrice: "110.00",
        stockQuantity: 18,
        lowStockThreshold: 5,
        isActive: true,
      },
      {
        name: "Audio Intercom Indoor Unit",
        description: "Wall-mounted audio intercom station",
        sku: "INT-AUD-IN",
        category: "intercom" as const,
        price: "59.99",
        costPrice: "32.00",
        stockQuantity: 28,
        lowStockThreshold: 8,
        isActive: true,
      },
      {
        name: "IP Video Intercom Panel",
        description: "Smart video intercom with mobile app support",
        sku: "INT-IP-PAN",
        category: "intercom" as const,
        price: "279.99",
        costPrice: "165.00",
        stockQuantity: 10,
        lowStockThreshold: 3,
        isActive: true,
      },
    ];

    await db.insert(products).values(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} products`);

    // Seed Services
    const sampleServices = [
      {
        name: "Network Installation - Basic",
        description: "Installation of up to 8 network points including cable routing and termination",
        category: "services" as const,
        price: "299.99",
        duration: "4-6 hours",
        isActive: true,
      },
      {
        name: "Network Installation - Premium",
        description: "Full network setup with router configuration, up to 16 points, and testing",
        category: "services" as const,
        price: "599.99",
        duration: "1-2 days",
        isActive: true,
      },
      {
        name: "CCTV Installation - 4 Cameras",
        description: "Installation of 4 cameras with NVR setup and mobile app configuration",
        category: "services" as const,
        price: "449.99",
        duration: "6-8 hours",
        isActive: true,
      },
      {
        name: "CCTV Installation - 8 Cameras",
        description: "Complete 8-camera surveillance system installation with remote viewing",
        category: "services" as const,
        price: "799.99",
        duration: "1-2 days",
        isActive: true,
      },
      {
        name: "Intercom System Installation",
        description: "Video door phone installation including wiring and configuration",
        category: "services" as const,
        price: "199.99",
        duration: "3-4 hours",
        isActive: true,
      },
      {
        name: "Network Maintenance - Monthly",
        description: "Monthly network health check, updates, and troubleshooting support",
        category: "services" as const,
        price: "149.99",
        duration: "Monthly",
        isActive: true,
      },
      {
        name: "IT Training - Basic Networking",
        description: "2-hour training session on network fundamentals and troubleshooting",
        category: "services" as const,
        price: "199.99",
        duration: "2 hours",
        isActive: true,
      },
      {
        name: "IT Training - CCTV Operation",
        description: "Training on CCTV system operation, playback, and basic maintenance",
        category: "services" as const,
        price: "149.99",
        duration: "2 hours",
        isActive: true,
      },
    ];

    await db.insert(services).values(sampleServices);
    console.log(`Inserted ${sampleServices.length} services`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
