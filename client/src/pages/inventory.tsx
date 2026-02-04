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
import { Search, Boxes, AlertTriangle, Package, TrendingDown } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && p.stockQuantity <= p.lowStockThreshold) ||
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
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "cctv":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "intercom":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === 0) {
      return { label: "Out of Stock", color: "bg-destructive text-destructive-foreground" };
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return { label: "Low Stock", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" };
    }
    return { label: "In Stock", color: "bg-green-500/10 text-green-600 dark:text-green-400" };
  };

  const getStockPercentage = (product: Product) => {
    const maxStock = Math.max(product.lowStockThreshold * 3, 100);
    return Math.min((product.stockQuantity / maxStock) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-inventory-title">
          Inventory
        </h1>
        <p className="text-muted-foreground">
          Monitor stock levels and inventory status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-products">
                  {totalProducts}
                </p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-low-stock">
                  {lowStockCount}
                </p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive" data-testid="text-out-of-stock">
                  {outOfStockCount}
                </p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Boxes className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-inventory-value">
                  ${totalValue.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5" />
              Stock Levels
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 lg:ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-48"
                  data-testid="input-search-inventory"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="cctv">CCTV</SelectItem>
                  <SelectItem value="intercom">Intercom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-stock-filter">
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : !filteredProducts || filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Boxes className="h-12 w-12 mb-4 opacity-50" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Value</TableHead>
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
                      >
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.sku || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getCategoryColor(product.category)}
                          >
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-40">
                          <Progress
                            value={stockPercentage}
                            className={`h-2 ${
                              product.stockQuantity === 0
                                ? "[&>div]:bg-destructive"
                                : product.stockQuantity <= product.lowStockThreshold
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-green-500"
                            }`}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {product.stockQuantity}
                          <span className="text-muted-foreground text-xs ml-1">
                            / min {product.lowStockThreshold}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(Number(product.price) * product.stockQuantity).toFixed(2)}
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
