"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Pencil, Trash2, Package, Tag, DollarSign, Layers, AlertCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  category: z.enum(["networking", "cctv", "intercom", "services"]),
  price: z.string().min(1, "Price is required"),
  costPrice: z.string().optional(),
  stockQuantity: z.number().min(0),
  lowStockThreshold: z.number().min(0),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => apiRequest("GET", "/api/products").then((res) => res.json()),
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      category: "networking",
      price: "",
      costPrice: "",
      stockQuantity: 0,
      lowStockThreshold: 10,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      toast({ title: "Product created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData & { id: string }) => {
      return apiRequest("PATCH", `/api/products/${data.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Product updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Product deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openCreateDialog = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      description: "",
      sku: "",
      category: "networking",
      price: "",
      costPrice: "",
      stockQuantity: 0,
      lowStockThreshold: 10,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      category: product.category as any,
      price: product.price.toString(),
      costPrice: product.costPrice ? product.costPrice.toString() : "",
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      isActive: product.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ ...data, id: editingProduct.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredProducts = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "networking":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50";
      case "cctv":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50";
      case "intercom":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50";
      case "services":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/50";
      default:
        return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading tracking-tight" data-testid="text-products-title">
            Product Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View, add, edit, and manage your product catalog
          </p>
        </div>
        <Button onClick={openCreateDialog} data-testid="button-add-product" className="h-10 px-6 font-semibold shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Card className="shadow-sm border-border/80 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <Package className="h-5 w-5 text-primary" />
              Catalog Details
            </CardTitle>
            <div className="relative group sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background transition-all focus-visible:ring-primary/30"
                data-testid="input-search-products"
              />
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
                  <Package className="h-12 w-12 text-muted-foreground/40" />
                </div>
              </div>
              <p className="font-semibold text-lg text-foreground/80">No products found</p>
              <p className="text-sm mt-1 mb-6">Your product catalog is currently empty matching that search.</p>
              <Button onClick={openCreateDialog} variant="outline" className="shadow-sm">
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Product Name</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold text-center">Category</TableHead>
                    <TableHead className="text-right font-semibold">Price</TableHead>
                    <TableHead className="text-right font-semibold">Stock</TableHead>
                    <TableHead className="text-center font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      data-testid={`row-product-${product.id}`}
                      className="group hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-md bg-secondary/20 flex items-center justify-center border border-secondary/30 text-secondary-foreground">
                            <Tag className="h-4 w-4" />
                          </div>
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono tracking-tight">
                        {product.sku || (
                          <span className="opacity-50 italic">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold tracking-wider rounded border ${getCategoryColor(product.category)}`}
                        >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        GH₵{Number(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex flex-col items-end">
                          <span
                            className={`font-semibold text-base ${
                              product.stockQuantity <= product.lowStockThreshold
                                ? product.stockQuantity === 0 
                                  ? "text-destructive" 
                                  : "text-yellow-600 dark:text-yellow-400"
                                : ""
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                          className={`text-[10px] uppercase font-bold tracking-wider rounded ${
                            product.isActive ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-transparent shadow-none" : ""
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => openEditDialog(product)}
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                            onClick={() => setDeleteConfirmId(product.id)}
                            data-testid={`button-delete-product-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 overflow-hidden border-border/80 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/5">
            <DialogTitle className="font-heading text-xl">
              {editingProduct ? "Edit Product Details" : "Create New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the information for this product below." : "Fill out the details to add a new product to the catalog."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-140px)] px-6 py-4">
            <Form {...form}>
              <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
                
                {/* General Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <FileText className="h-4 w-4" /> General Information
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                            <Input
                              {...field}
                              placeholder="e.g. Ubiquiti UniFi U6 Lite"
                              className="pl-10"
                              data-testid="input-product-name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. U6-LITE-US"
                              className="font-mono text-sm h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                              data-testid="input-product-sku"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors" data-testid="select-product-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="networking">Networking</SelectItem>
                              <SelectItem value="cctv">CCTV</SelectItem>
                              <SelectItem value="intercom">Intercom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Brief description of the product..."
                            rows={3}
                            className="resize-none bg-muted/40 border-border/50 focus:bg-background transition-colors"
                            data-testid="input-product-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pricing Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <DollarSign className="h-4 w-4" /> Pricing
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">GH₵</span>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7 font-semibold h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                                data-testid="input-product-price"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">GH₵</span>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7 h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                                data-testid="input-product-cost"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Inventory Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <Layers className="h-4 w-4" /> Inventory Management
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stockQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              className="h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-product-stock"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Alert Threshold</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                className="pl-10 h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                data-testid="input-product-threshold"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-4 pt-2 pb-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4 hover:bg-muted/30 transition-colors">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-foreground font-semibold">Active Status</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Toggle off to hide this product from POS and sales flows.
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                            data-testid="switch-product-active"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-muted/5 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="product-form"
              className="px-6 font-semibold shadow-sm"
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-product"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingProduct
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-destructive font-heading">
              <AlertCircle className="h-5 w-5" />
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-muted-foreground">
              Are you sure you want to permanently delete this product? This action cannot be undone and will remove it from all future sales.
            </p>
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-muted/5 sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              className="font-semibold"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
