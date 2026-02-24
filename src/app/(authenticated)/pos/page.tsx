"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  Wrench,
  CreditCard,
  Receipt,
  User,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Service } from "@shared/schema";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "service";
  productId?: string;
  serviceId?: string;
  maxStock?: number;
}

export default function POS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => apiRequest("GET", "/api/products").then((res) => res.json()),
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: () => apiRequest("GET", "/api/services").then((res) => res.json()),
  });

  const createSaleMutation = useMutation({
    mutationFn: async (saleData: {
      customerName: string;
      customerPhone: string;
      discount: number;
      items: {
        productId?: string;
        serviceId?: string;
        name: string;
        quantity: number;
        unitPrice: number;
      }[];
    }) => {
      const response = await apiRequest("POST", "/api/sales", saleData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Sale completed!",
        description: "Transaction has been recorded successfully.",
      });
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      setIsCheckoutOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Sale failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter(
    (p) =>
      p.isActive &&
      p.stockQuantity > 0 &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredServices = services?.filter(
    (s) =>
      s.isActive && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (
    item: Product | Service,
    type: "product" | "service"
  ) => {
    const existingItem = cart.find((c) => c.id === item.id && c.type === type);

    if (existingItem) {
      if (type === "product") {
        const product = item as Product;
        if (existingItem.quantity >= product.stockQuantity) {
          toast({
            title: "Stock limit reached",
            description: `Only ${product.stockQuantity} units available.`,
            variant: "destructive",
          });
          return;
        }
      }
      setCart(
        cart.map((c) =>
          c.id === item.id && c.type === type
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      const cartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
        type,
        productId: type === "product" ? item.id : undefined,
        serviceId: type === "service" ? item.id : undefined,
        maxStock:
          type === "product" ? (item as Product).stockQuantity : undefined,
      };
      setCart([...cart, cartItem]);
    }
  };

  const updateQuantity = (itemId: string, type: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === itemId && item.type === type) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            if (item.maxStock && newQuantity > item.maxStock) {
              toast({
                title: "Stock limit reached",
                description: `Only ${item.maxStock} units available.`,
                variant: "destructive",
              });
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string, type: string) => {
    setCart(cart.filter((c) => !(c.id === itemId && c.type === type)));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to the cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const confirmSale = () => {
    createSaleMutation.mutate({
      customerName,
      customerPhone,
      discount: discountAmount,
      items: cart.map((item) => ({
        productId: item.productId,
        serviceId: item.serviceId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    });
  };

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

  const isLoading = productsLoading || servicesLoading;

  return (
    <div className="h-[calc(100vh-60px)] -m-4 md:-m-6 lg:-m-8 flex flex-col lg:flex-row bg-muted/10">
      {/* Product/Service Selection */}
      <div className="flex-1 flex flex-col min-h-0 p-4 lg:p-6 lg:pr-3">
        <Card className="flex-1 flex flex-col min-h-0 border-border/60 shadow-sm overflow-hidden bg-background">
          <CardHeader className="pb-4 pt-5 px-5 border-b bg-muted/10">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-2 font-heading text-xl">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Point of Sale
              </CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catalog... (e.g. Router, Camera)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border/60 shadow-sm h-11 transition-all focus-visible:ring-primary/30"
                data-testid="input-pos-search"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
            <Tabs defaultValue="products" className="h-full flex flex-col px-5 pt-4">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
                <TabsTrigger
                  value="products"
                  data-testid="tab-products"
                  className="gap-2 data-[state=active]:shadow-sm transition-all"
                >
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  data-testid="tab-services"
                  className="gap-2 data-[state=active]:shadow-sm transition-all"
                >
                  <Wrench className="h-4 w-4" />
                  Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="flex-1 min-h-0 mt-4 outline-none">
                <ScrollArea className="h-full pb-6">
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                      {[...Array(9)].map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl" />
                      ))}
                    </div>
                  ) : !filteredProducts || filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground bg-muted/20 rounded-xl border border-dashed mt-4">
                      <Package className="h-12 w-12 mb-4 opacity-30" />
                      <p className="font-medium">No products match your search</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xl:gap-4 pb-4">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product, "product")}
                          className="group relative flex flex-col p-4 border border-border/60 rounded-xl text-left hover-elevate active-elevate-2 transition-all bg-background hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          data-testid={`button-add-product-${product.id}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
                          <div className="font-semibold text-sm line-clamp-2 leading-tight flex-1">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 mt-3 overflow-hidden">
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase font-bold tracking-wider rounded border ${getCategoryColor(product.category)}`}
                            >
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-end justify-between mt-3 w-full">
                            <span className="font-bold text-lg text-primary leading-none">
                              GH₵{Number(product.price).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide bg-muted/50 px-1.5 py-0.5 rounded">
                              {product.stockQuantity} in stock
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="services" className="flex-1 min-h-0 mt-4 outline-none">
                <ScrollArea className="h-full pb-6">
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl" />
                      ))}
                    </div>
                  ) : !filteredServices || filteredServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground bg-muted/20 rounded-xl border border-dashed mt-4">
                      <Wrench className="h-12 w-12 mb-4 opacity-30" />
                      <p className="font-medium">No services match your search</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xl:gap-4 pb-4">
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => addToCart(service, "service")}
                          className="group relative flex flex-col p-4 border border-border/60 rounded-xl text-left hover-elevate active-elevate-2 transition-all bg-background hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          data-testid={`button-add-service-${service.id}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-secondary group-hover:bg-secondary/80 transition-colors" />
                          <div className="font-semibold text-sm line-clamp-2 leading-tight flex-1">
                            {service.name}
                          </div>
                          {service.duration && (
                            <div className="mt-3">
                              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider rounded">
                                {service.duration} mins
                              </Badge>
                            </div>
                          )}
                          <div className="flex items-end justify-between mt-3 w-full">
                            <span className="font-bold text-lg text-primary leading-none">
                              GH₵{Number(service.price).toFixed(2)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col min-h-0 p-4 lg:p-6 lg:pl-3">
        <Card className="flex-1 flex flex-col min-h-0 border-border/60 shadow-sm overflow-hidden relative">
          <CardHeader className="pb-4 pt-5 px-5 bg-background border-b relative z-10">
            <CardTitle className="flex items-center justify-between font-heading">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Current Order
              </span>
              {cart.length > 0 && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0 p-0 relative bg-muted/5">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
                  <div className="bg-background rounded-full p-6 border border-border/50 relative shadow-sm">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                </div>
                <p className="font-medium text-foreground/80 mb-1">Your cart is empty</p>
                <p className="text-sm">Scan or select items to begin</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {cart.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="group flex flex-col p-3 bg-background border border-border/60 rounded-xl shadow-sm hover:border-primary/20 transition-colors"
                        data-testid={`card-cart-item-${item.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="pr-4">
                            <p className="font-semibold text-sm leading-tight text-foreground">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              GH₵{item.price.toFixed(2)} each
                            </p>
                          </div>
                          <p className="font-bold text-sm">
                            GH₵{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider rounded border-0 bg-muted/50 ${item.type === 'product' ? 'text-blue-500' : 'text-orange-500'}`}>
                            {item.type}
                          </Badge>
                          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
                            <button
                              type="button"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-background hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-muted-foreground hover:text-foreground"
                              onClick={() => updateQuantity(item.id, item.type, -1)}
                              data-testid={`button-decrease-${item.id}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-background hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-muted-foreground hover:text-foreground"
                              onClick={() => updateQuantity(item.id, item.type, 1)}
                              data-testid={`button-increase-${item.id}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <button
                              type="button"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive text-muted-foreground"
                              onClick={() => removeFromCart(item.id, item.type)}
                              data-testid={`button-remove-${item.id}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-5 bg-background border-t shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] relative z-10">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">GH₵{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-destructive font-medium bg-destructive/5 p-1.5 -mx-1.5 rounded-md px-1.5">
                        <span className="flex items-center gap-1">Discount <Badge variant="destructive" className="h-4 px-1 text-[9px] min-w-0">{discount}%</Badge></span>
                        <span>-GH₵{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-3 opacity-50" />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total</span>
                      <span className="text-3xl font-bold tracking-tighter text-primary">
                        GH₵{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
                    size="lg"
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Process Payment
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/80 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/5">
            <DialogTitle className="font-heading text-xl">Complete Transaction</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-5">
            <div className="space-y-4 bg-background">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Customer Details (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerName"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="pl-10 h-11"
                    data-testid="input-customer-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerPhone"
                    placeholder="(555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="pl-10 h-11"
                    data-testid="input-customer-phone"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="discount" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Apply Discount</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount || ''}
                    placeholder="0"
                    onChange={(e) =>
                      setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))
                    }
                    className="pl-8 h-11 font-medium"
                    data-testid="input-discount"
                  />
                </div>
                {[10, 15, 20].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={discount === preset ? "default" : "outline"}
                    className="h-11 px-3 tabular-nums font-semibold"
                    onClick={() => setDiscount(preset)}
                  >
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border/50">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-destructive font-medium">
                  <span>Discount ({discount}%)</span>
                  <span>-GH₵{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total Due</span>
                <span className="text-primary text-2xl tracking-tighter">GH₵{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-muted/5 sm:justify-between items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsCheckoutOpen(false)}
              className="text-muted-foreground"
              data-testid="button-cancel-checkout"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSale}
              disabled={createSaleMutation.isPending}
              className="h-11 px-8 font-bold"
              data-testid="button-confirm-sale"
            >
              {createSaleMutation.isPending ? "Confirming..." : "Complete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
