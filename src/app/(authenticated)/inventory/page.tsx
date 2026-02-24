"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
import { Search, Boxes, AlertTriangle, Package, TrendingDown, Filter } from "lucide-react";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => apiRequest("GET", "/api/products").then((res) => res.json()),
  });

  const filteredProducts = products?.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0) ||
      (stockFilter === "out" && p.stockQuantity === 0) ||
      (stockFilter === "normal" && p.stockQuantity > p.lowStockThreshold);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalProducts = products?.length || 0;
  const lowStockCount =
    products?.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0)
      .length || 0;
  const outOfStockCount =
    products?.filter((p) => p.stockQuantity === 0).length || 0;
  const totalValue =
    products?.reduce(
      (sum, p) => sum + Number(p.price) * p.stockQuantity,
      0
    ) || 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "networking":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50";
      case "cctv":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50";
      case "intercom":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50";
      default:
        return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === 0) {
      return { label: "Out of Stock", color: "bg-destructive/10 text-destructive border-destructive/20" };
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return { label: "Low Stock", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" };
    }
    return { label: "In Stock", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" };
  };

  const getStockPercentage = (product: Product) => {
    const maxStock = Math.max(product.lowStockThreshold * 3, 100);
    return Math.min((product.stockQuantity / maxStock) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold font-heading tracking-tight" data-testid="text-inventory-title">
          Inventory Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor your stock levels, trace items, and manage inventory operations.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter" data-testid="text-total-products">
                  {totalProducts}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-sm">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-yellow-600 dark:text-yellow-400" data-testid="text-low-stock">
                  {lowStockCount}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-destructive/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive/50 group-hover:bg-destructive transition-colors" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center border border-destructive/20 shadow-sm">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-destructive" data-testid="text-out-of-stock">
                  {outOfStockCount}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-sm">
                <Boxes className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter" data-testid="text-inventory-value">
                  GH₵{totalValue.toFixed(2)}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/80 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <Boxes className="h-5 w-5 text-primary" />
              Stock Directory
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64 bg-background transition-all focus-visible:ring-primary/30"
                  data-testid="input-search-inventory"
                />
              </div>
              <div className="flex items-center gap-2 bg-background border rounded-md px-1 shadow-sm">
                <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0" data-testid="select-category-filter">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="cctv">CCTV</SelectItem>
                    <SelectItem value="intercom">Intercom</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-px h-4 bg-border" />
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0" data-testid="select-stock-filter">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="normal">In Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : !filteredProducts || filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/5 min-h-[300px]">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl" />
                <div className="bg-background rounded-full p-6 border border-border/50 shadow-sm relative">
                  <Boxes className="h-12 w-12 text-muted-foreground/40" />
                </div>
              </div>
              <p className="font-semibold text-lg text-foreground/80">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold w-[200px]">Stock Level</TableHead>
                    <TableHead className="text-right font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    const stockPercentage = getStockPercentage(product);
                    return (
                      <TableRow
                        key={product.id}
                        data-testid={`row-inventory-${product.id}`}
                        className="group hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground py-4">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm font-mono tracking-tight">
                          {product.sku || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-bold tracking-wider rounded border ${getCategoryColor(product.category)}`}
                          >
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5 w-full max-w-[150px]">
                            <Progress
                              value={stockPercentage}
                              className={`h-2 bg-muted/50 ${
                                product.stockQuantity === 0
                                  ? "[&>div]:bg-destructive"
                                  : product.stockQuantity <= product.lowStockThreshold
                                    ? "[&>div]:bg-yellow-500"
                                    : "[&>div]:bg-green-500"
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-base">{product.stockQuantity}</span>
                          <div className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold mt-0.5">
                            Min: {product.lowStockThreshold}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-semibold border ${stockStatus.color}`}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          GH₵{(Number(product.price) * product.stockQuantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
