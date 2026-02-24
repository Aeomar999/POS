module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/pg)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$pg$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$pg$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
// Setup connection pool and Prisma Pg Adapter
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL
});
const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"](pool);
const prisma = global.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    adapter
});
const db = prisma; // Alias to prevent breaking too many imports right away
if ("TURBOPACK compile-time truthy", 1) global.prisma = prisma;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DatabaseStorage",
    ()=>DatabaseStorage,
    "storage",
    ()=>storage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
class DatabaseStorage {
    // Users
    async getUsers() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    async getUser(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id
            }
        }) || undefined;
    }
    async getUserByUsername(username) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                username
            }
        }) || undefined;
    }
    async createUser(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data
        });
    }
    async updateUser(id, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
            where: {
                id
            },
            data
        });
    }
    async deleteUser(id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.delete({
            where: {
                id
            }
        });
        return true;
    }
    // Products
    async getProducts() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    async getProduct(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
            where: {
                id
            }
        }) || undefined;
    }
    async getLowStockProducts() {
        // raw query syntax simulation or advanced findMany
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
            where: {
                isActive: true
            }
        });
        return products.filter((p)=>p.stockQuantity <= p.lowStockThreshold);
    }
    async createProduct(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.create({
            data
        });
    }
    async updateProduct(id, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.update({
            where: {
                id
            },
            data
        });
    }
    async deleteProduct(id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.delete({
            where: {
                id
            }
        });
        return true;
    }
    // Services
    async getServices() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].service.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    async getService(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].service.findUnique({
            where: {
                id
            }
        }) || undefined;
    }
    async createService(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].service.create({
            data
        });
    }
    async updateService(id, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].service.update({
            where: {
                id
            },
            data
        });
    }
    async deleteService(id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].service.delete({
            where: {
                id
            }
        });
        return true;
    }
    // Sales
    async getSales() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    async getSale(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findUnique({
            where: {
                id
            }
        }) || undefined;
    }
    async getSalesByDateRange(startDate, endDate) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    async createSale(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.create({
            data
        });
    }
    async updateSale(id, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.update({
            where: {
                id
            },
            data
        });
    }
    // Sale Items
    async getSaleItems(saleId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].saleItem.findMany({
            where: {
                saleId
            }
        });
    }
    async createSaleItem(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].saleItem.create({
            data
        });
    }
    // Dashboard
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaySalesData = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        const todaySales = todaySalesData.length;
        const todayRevenue = todaySalesData.reduce((sum, s)=>sum + Number(s.total), 0);
        const totalProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.count();
        const totalServices = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].service.count();
        const lowStockCount = (await this.getLowStockProducts()).length;
        const recentSales = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        });
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - 6);
        const weeklySalesData = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            where: {
                createdAt: {
                    gte: weekStart
                }
            }
        });
        const weeklySales = [];
        for(let i = 6; i >= 0; i--){
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            const dayTotal = weeklySalesData.filter((s)=>{
                const saleDate = new Date(s.createdAt);
                return saleDate >= dayStart && saleDate <= dayEnd;
            }).reduce((sum, s)=>sum + Number(s.total), 0);
            weeklySales.push({
                day: dayName,
                total: dayTotal
            });
        }
        return {
            todaySales,
            todayRevenue,
            totalProducts,
            totalServices,
            lowStockCount,
            recentSales,
            weeklySales
        };
    }
    // Reports
    async getSalesReport(period) {
        const now = new Date();
        let startDate;
        switch(period){
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
        const salesData = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                items: true
            }
        });
        const totalSales = salesData.length;
        const totalRevenue = salesData.reduce((sum, s)=>sum + Number(s.total), 0);
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        const allSaleItems = salesData.flatMap((s)=>s.items);
        // Sales by day
        const salesByDayMap = new Map();
        for (const sale of salesData){
            const date = new Date(sale.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
            const existing = salesByDayMap.get(date) || {
                total: 0,
                count: 0
            };
            salesByDayMap.set(date, {
                total: existing.total + Number(sale.total),
                count: existing.count + 1
            });
        }
        const salesByDay = Array.from(salesByDayMap.entries()).map(([date, data])=>({
                date,
                total: data.total,
                count: data.count
            }));
        // Sales by category
        const salesByCategory = [
            {
                category: "networking",
                total: 0,
                count: 0
            },
            {
                category: "cctv",
                total: 0,
                count: 0
            },
            {
                category: "intercom",
                total: 0,
                count: 0
            },
            {
                category: "services",
                total: 0,
                count: 0
            }
        ];
        for (const item of allSaleItems){
            if (item.productId) {
                const product = await this.getProduct(item.productId);
                if (product) {
                    const cat = salesByCategory.find((c)=>c.category === product.category);
                    if (cat) {
                        cat.total += Number(item.total);
                        cat.count += item.quantity;
                    }
                }
            } else if (item.serviceId) {
                const cat = salesByCategory.find((c)=>c.category === "services");
                if (cat) {
                    cat.total += Number(item.total);
                    cat.count += item.quantity;
                }
            }
        }
        // Top products
        const productSales = new Map();
        for (const item of allSaleItems){
            const existing = productSales.get(item.name) || {
                quantity: 0,
                revenue: 0
            };
            productSales.set(item.name, {
                quantity: existing.quantity + item.quantity,
                revenue: existing.revenue + Number(item.total)
            });
        }
        const topProducts = Array.from(productSales.entries()).map(([name, data])=>({
                name,
                quantity: data.quantity,
                revenue: data.revenue
            })).sort((a, b)=>b.revenue - a.revenue).slice(0, 10);
        return {
            totalSales,
            totalRevenue,
            averageOrderValue,
            salesByDay,
            salesByCategory: salesByCategory.filter((c)=>c.total > 0),
            topProducts,
            recentSales: salesData.slice(0, 20)
        };
    }
    // Settings
    async getUserSettings(userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userSettings.findUnique({
            where: {
                userId
            }
        }) || undefined;
    }
    async createUserSettings(userId, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userSettings.create({
            data: {
                userId,
                ...data
            }
        });
    }
    async updateUserSettings(userId, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userSettings.upsert({
            where: {
                userId
            },
            update: data,
            create: {
                userId,
                ...data
            }
        });
    }
    // Notifications
    async getNotifications(userId, limit = 20) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notification.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: limit
        });
    }
    async markNotificationAsRead(userId, notificationId) {
        if (notificationId) {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notification.updateMany({
                where: {
                    id: notificationId,
                    userId
                },
                data: {
                    isRead: true
                }
            });
            return {
                count: res.count
            };
        } else {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notification.updateMany({
                where: {
                    userId,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            });
            return {
                count: res.count
            };
        }
    }
}
const storage = new DatabaseStorage();
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "clearCookieAuth",
    ()=>clearCookieAuth,
    "comparePasswords",
    ()=>comparePasswords,
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt,
    "getSession",
    ()=>getSession,
    "getUserFromSession",
    ()=>getUserFromSession,
    "hashedPassword",
    ()=>hashedPassword,
    "setCookieAuth",
    ()=>setCookieAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/jose/dist/node/esm/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
// --- JWT Setup ---
const secretKey = process.env.SESSION_SECRET || "fallback_secret_key_for_development";
const key = new TextEncoder().encode(secretKey);
async function encrypt(payload) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime("24h").sign(key);
}
async function decrypt(input) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(input, key, {
            algorithms: [
                "HS256"
            ]
        });
        return payload;
    } catch (error) {
        return null;
    }
}
async function setCookieAuth(user) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({
        user,
        expires
    });
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("session", session, {
        expires,
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/"
    });
}
async function clearCookieAuth() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("session", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/"
    });
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}
async function getUserFromSession() {
    const session = await getSession();
    if (!session || !session.user) return null;
    try {
        const freshUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].getUser(session.user.id);
        if (!freshUser || !freshUser.isActive) return null;
        const { password, ...userWithoutPassword } = freshUser;
        return userWithoutPassword;
    } catch (err) {
        return null;
    }
}
// --- Password Hashing Setup ---
const scryptAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["scrypt"]);
async function hashedPassword(password) {
    const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(hashedBuf, suppliedBuf);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/PROJECT 2026/SiliconPOS/src/app/api/notifications/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/PROJECT 2026/SiliconPOS/src/lib/auth.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function GET(req) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromSession"])();
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
        const notifications = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].getNotifications(user.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(notifications);
    } catch (error) {
        console.error("[NOTIFICATIONS GET ERROR]", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$PROJECT__2026$2f$SiliconPOS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Internal server error"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e88be0c6._.js.map