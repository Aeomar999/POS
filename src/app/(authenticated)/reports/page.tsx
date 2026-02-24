"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Package,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import type { Sale } from "@shared/schema";

interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  salesByDay: { date: string; total: number; count: number }[];
  salesByCategory: { category: string; total: number; count: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  recentSales: Sale[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 210, 100%, 50%))",
  "hsl(var(--chart-3, 270, 100%, 50%))",
  "hsl(var(--chart-4, 30, 100%, 50%))",
  "hsl(var(--chart-5, 330, 100%, 50%))"
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border/50 p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-sm font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-medium">
              {entry.name.includes("Revenue") ? "GH₵" : ""}{entry.value.toLocaleString(undefined, {
                minimumFractionDigits: entry.name.includes("Revenue") ? 2 : 0,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [period, setPeriod] = useState<string>("week");

  const { data: report, isLoading } = useQuery<SalesReport>({
    queryKey: ["/api/reports/sales", period],
    queryFn: async () => {
      const response = await fetch(`/api/reports/sales?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading tracking-tight" data-testid="text-reports-title">
            Business Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive insights into your sales performance and trends
          </p>
        </div>
        <div className="flex items-center bg-background border rounded-lg p-1 shadow-sm">
          <Calendar className="h-4 w-4 text-muted-foreground ml-3 mr-2 hidden sm:block" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] border-0 shadow-none focus:ring-0 font-medium" data-testid="select-report-period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[400px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold bg-background/50 backdrop-blur-sm">
                    Revenue
                  </Badge>
                </div>
                <div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold tracking-tighter" data-testid="text-report-total-revenue">
                      GH₵{(report?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" /> Total gross revenue
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold bg-background/50 backdrop-blur-sm">
                    Orders
                  </Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tighter" data-testid="text-report-total-sales">
                    {report?.totalSales?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-1">
                    <Activity className="h-3 w-3 text-blue-500" /> Total completed transactions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold bg-background/50 backdrop-blur-sm">
                    AOV
                  </Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tighter" data-testid="text-report-avg-order">
                    GH₵{(report?.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-1">
                    <Package className="h-3 w-3 text-emerald-500" /> Avg. value per transaction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="charts" className="space-y-6">
            <div className="flex justify-start">
              <TabsList className="bg-muted/50 p-1 rounded-xl h-12">
                <TabsTrigger value="charts" data-testid="tab-charts" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all focus-visible:ring-0">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Visual Analytics
                </TabsTrigger>
                <TabsTrigger value="transactions" data-testid="tab-transactions" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all focus-visible:ring-0">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="products" data-testid="tab-top-products" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all focus-visible:ring-0">
                  <Package className="mr-2 h-4 w-4" />
                  Top Products
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="charts" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="grid gap-6 lg:grid-cols-7">
                {/* Sales Trend */}
                <Card className="lg:col-span-4 shadow-sm border-border/80">
                  <CardHeader className="border-b bg-muted/5 px-6 py-5">
                    <CardTitle className="flex items-center gap-2 font-heading text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Revenue Trend
                    </CardTitle>
                    <CardDescription>
                      Performance over the selected {period} period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[300px]">
                      {!report?.salesByDay || report.salesByDay.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
                          <BarChart3 className="h-12 w-12 mb-4" />
                          <p>No sales data available for this period</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={report.salesByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis 
                              dataKey="date" 
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                              dy={10}
                            />
                            <YAxis 
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                              tickFormatter={(value) => `GH₵${value}`}
                              dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Line
                              type="monotone"
                              dataKey="total"
                              name="Revenue"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              dot={{ stroke: "hsl(var(--primary))", strokeWidth: 2, r: 4, fill: "hsl(var(--background))" }}
                              activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sales by Category */}
                <Card className="lg:col-span-3 shadow-sm border-border/80 flex flex-col">
                  <CardHeader className="border-b bg-muted/5 px-6 py-5">
                    <CardTitle className="flex items-center gap-2 font-heading text-lg">
                      <PieChart className="h-5 w-5 text-primary" />
                      Revenue by Category
                    </CardTitle>
                    <CardDescription>
                      Distribution of total sales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col relative justify-center">
                    <div className="h-[280px]">
                      {!report?.salesByCategory || report.salesByCategory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
                          <Package className="h-12 w-12 mb-4" />
                          <p>No category data available</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={report.salesByCategory}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="total"
                              stroke="none"
                            >
                              {report.salesByCategory.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    {report?.salesByCategory && report.salesByCategory.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        {report.salesByCategory.map((category, index) => (
                          <div key={category.category} className="flex items-center gap-2 border border-border/50 rounded-md p-2 bg-muted/20">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="truncate flex-1 font-medium capitalize">{category.category}</span>
                            <span className="font-mono text-xs opacity-70">GH₵{category.total.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="animate-in fade-in-50 duration-500">
              <Card className="shadow-sm border-border/80">
                <CardHeader className="border-b bg-muted/5 px-6 py-5">
                  <CardTitle className="font-heading text-lg">Transaction History</CardTitle>
                  <CardDescription>Complete log of sales during the selected period</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {!report?.recentSales || report.recentSales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/50">
                      <ShoppingCart className="h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">No transactions found</p>
                      <p className="text-sm mt-1">Try selecting a different time period.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold py-4 px-6">Sale #</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date & Time</TableHead>
                            <TableHead className="font-semibold text-center">Status</TableHead>
                            <TableHead className="text-right font-semibold px-6">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {report.recentSales.map((sale) => (
                            <TableRow key={sale.id} data-testid={`row-sale-${sale.id}`} className="hover:bg-muted/20 transition-colors">
                              <TableCell className="font-mono text-sm px-6 font-medium">
                                {sale.saleNumber}
                              </TableCell>
                              <TableCell className="font-medium">
                                {sale.customerName ? (
                                  <div>
                                    {sale.customerName}
                                    {sale.customerPhone && <div className="text-xs text-muted-foreground font-normal">{sale.customerPhone}</div>}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground italic">Walk-in</span>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {new Date(sale.createdAt!).toLocaleDateString(undefined, {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })}
                                <span className="text-xs ml-2 opacity-70">
                                  {new Date(sale.createdAt!).toLocaleTimeString(undefined, {
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  className={`text-[10px] uppercase font-bold tracking-wider rounded ${
                                    sale.status === "completed"
                                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-none shadow-none hover:bg-green-500/20"
                                      : sale.status === "pending"
                                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-none shadow-none hover:bg-yellow-500/20"
                                        : "bg-destructive/10 text-destructive border-none shadow-none hover:bg-destructive/20"
                                  }`}
                                >
                                  {sale.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold px-6 text-foreground">
                                GH₵{Number(sale.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="animate-in fade-in-50 duration-500">
              <Card className="shadow-sm border-border/80">
                <CardHeader className="border-b bg-muted/5 px-6 py-5">
                  <CardTitle className="font-heading text-lg">Top Performing Products</CardTitle>
                  <CardDescription>Items that generated the most revenue in the selected period</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {!report?.topProducts || report.topProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/50">
                      <Package className="h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">No product data available</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-center w-24">Rank</TableHead>
                            <TableHead className="font-semibold">Product Name</TableHead>
                            <TableHead className="text-center font-semibold">Units Sold</TableHead>
                            <TableHead className="text-right font-semibold px-6">Total Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {report.topProducts.map((product, index) => (
                            <TableRow key={product.name} className="hover:bg-muted/20 transition-colors">
                              <TableCell className="text-center font-bold">
                                {index < 3 ? (
                                  <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                                    index === 0 ? "bg-amber-400 text-amber-950" :
                                    index === 1 ? "bg-slate-300 text-slate-900" :
                                    "bg-amber-700/50 text-amber-100"
                                  }`}>
                                    #{index + 1}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/70">#{index + 1}</span>
                                )}
                              </TableCell>
                              <TableCell className="font-medium text-foreground">
                                {product.name}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="font-mono text-sm px-2 py-0">
                                  {product.quantity}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold text-primary px-6">
                                ${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
