"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiRequest } from "@/lib/queryClient";
import type { Product, Sale } from "@shared/schema";

interface DashboardStats {
  todaySales: number;
  todayRevenue: number;
  totalProducts: number;
  totalServices: number;
  lowStockCount: number;
  recentSales: Sale[];
  weeklySales: { day: string; total: number }[];
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard/stats").then((res) => res.json()),
  });

  const { data: lowStockProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/low-stock"],
    queryFn: () => apiRequest("GET", "/api/products/low-stock").then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
          <Skeleton className="h-96 lg:col-span-4 rounded-xl" />
          <Skeleton className="h-96 lg:col-span-3 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-heading tracking-tight" data-testid="text-dashboard-title">
          Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's your business overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate transition-all duration-200 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div
              className="text-3xl font-bold tracking-tighter"
              data-testid="text-today-sales-count"
            >
              {stats?.todaySales || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary inline-flex items-center font-medium"><TrendingUp className="h-3 w-3 mr-1"/> Transactions</span> completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Revenue
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div
              className="text-3xl font-bold tracking-tighter"
              data-testid="text-today-revenue"
            >
              GH₵{(stats?.todayRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">total earnings today</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
            <div className="p-2 bg-secondary rounded-lg">
              <Package className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="text-3xl font-bold tracking-tighter"
              data-testid="text-total-products"
            >
              {stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-balance">active items in catalog</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Services</CardTitle>
            <div className="p-2 bg-secondary rounded-lg">
              <Wrench className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="text-3xl font-bold tracking-tighter"
              data-testid="text-total-services"
            >
              {stats?.totalServices || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">available to book</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Weekly Sales Chart */}
        <Card className="lg:col-span-4 flex flex-col shadow-sm border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading tracking-tight text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Sales Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.weeklySales || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `GH₵${value}`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-md)",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {/* Low Stock Alert */}
          <Card className="border-destructive/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive/50" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-heading">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!lowStockProducts || lowStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  <Package className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm font-medium">All products well-stocked!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-background hover:bg-muted/40 rounded-lg border border-border/50 transition-colors relative overflow-hidden group"
                      data-testid={`card-low-stock-${product.id}`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-destructive/40 group-hover:bg-destructive transition-colors" />
                      <div className="pl-3">
                        <p className="font-medium text-sm leading-tight text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive leading-tight">
                          {product.stockQuantity}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Left</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="shadow-sm border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-heading">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {!stats?.recentSales || stats.recentSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No recent transactions</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recentSales.slice(0, 4).map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 bg-secondary/10 hover:bg-secondary/30 rounded-lg transition-colors border border-transparent hover:border-border/50"
                      data-testid={`card-recent-sale-${sale.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-background rounded-md p-2 border shadow-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm leading-tight">{sale.saleNumber}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {sale.customerName || "Walk-in Customer"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm leading-tight">GH₵{Number(sale.total).toFixed(2)}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                          {new Date(sale.createdAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
