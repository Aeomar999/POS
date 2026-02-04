import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Legend,
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

const COLORS = ["hsl(0, 72%, 51%)", "#333333", "#666666", "#999999", "#CCCCCC"];

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-reports-title">
            Sales Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze your sales performance and trends
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40" data-testid="select-report-period">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              data-testid="text-report-total-sales"
            >
              {report?.totalSales || 0}
            </div>
            <p className="text-xs text-muted-foreground">transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold text-primary"
              data-testid="text-report-total-revenue"
            >
              ${(report?.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">gross revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              data-testid="text-report-avg-order"
            >
              ${(report?.averageOrderValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts" data-testid="tab-charts">
            <BarChart3 className="mr-2 h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-top-products">
            <Package className="mr-2 h-4 w-4" />
            Top Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {!report?.salesByDay || report.salesByDay.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                      <p>No sales data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={report.salesByDay}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          name="Revenue ($)"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {!report?.salesByCategory ||
                  report.salesByCategory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Package className="h-12 w-12 mb-4 opacity-50" />
                      <p>No category data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={report.salesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) =>
                            `${category} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="total"
                        >
                          {report.salesByCategory.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {!report?.recentSales || report.recentSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
                  <p>No transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sale #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.recentSales.map((sale) => (
                        <TableRow
                          key={sale.id}
                          data-testid={`row-sale-${sale.id}`}
                        >
                          <TableCell className="font-medium">
                            {sale.saleNumber}
                          </TableCell>
                          <TableCell>
                            {sale.customerName || "Walk-in Customer"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(sale.createdAt!).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                sale.status === "completed"
                                  ? "default"
                                  : sale.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {sale.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${Number(sale.total).toFixed(2)}
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

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {!report?.topProducts || report.topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-50" />
                  <p>No product data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.topProducts.map((product, index) => (
                        <TableRow key={product.name}>
                          <TableCell>
                            <Badge variant="outline" className="font-bold">
                              #{index + 1}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            ${product.revenue.toFixed(2)}
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
    </div>
  );
}
