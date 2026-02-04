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
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
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
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "cctv":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "intercom":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "services":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isLoading = productsLoading || servicesLoading;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 p-4">
      {/* Product/Service Selection */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Point of Sale
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-pos-search"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <Tabs defaultValue="products" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="products"
                  data-testid="tab-products"
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  data-testid="tab-services"
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="flex-1 min-h-0 mt-4">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-28" />
                      ))}
                    </div>
                  ) : !filteredProducts || filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                      <Package className="h-12 w-12 mb-4 opacity-50" />
                      <p>No products found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product, "product")}
                          className="p-3 border rounded-lg text-left hover-elevate active-elevate-2 transition-colors"
                          data-testid={`button-add-product-${product.id}`}
                        >
                          <div className="font-medium text-sm truncate">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getCategoryColor(product.category)}`}
                            >
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Stock: {product.stockQuantity}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="services" className="flex-1 min-h-0 mt-4">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-28" />
                      ))}
                    </div>
                  ) : !filteredServices || filteredServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                      <Wrench className="h-12 w-12 mb-4 opacity-50" />
                      <p>No services found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => addToCart(service, "service")}
                          className="p-3 border rounded-lg text-left hover-elevate active-elevate-2 transition-colors"
                          data-testid={`button-add-service-${service.id}`}
                        >
                          <div className="font-medium text-sm truncate">
                            {service.name}
                          </div>
                          {service.duration && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {service.duration}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className="font-bold text-primary">
                              ${Number(service.price).toFixed(2)}
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

      {/* Cart */}
      <div className="w-full lg:w-96 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Cart
              </span>
              {cart.length > 0 && (
                <Badge variant="secondary">{cart.length} items</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products or services to begin</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 -mx-2 px-2">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                        data-testid={`card-cart-item-${item.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.type, -1)
                            }
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.type, 1)
                            }
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeFromCart(item.id, item.type)}
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-destructive">
                      <span>Discount ({discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="pl-10"
                  data-testid="input-customer-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customerPhone"
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="pl-10"
                  data-testid="input-customer-phone"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) =>
                  setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))
                }
                data-testid="input-discount"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-destructive">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
              data-testid="button-cancel-checkout"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSale}
              disabled={createSaleMutation.isPending}
              data-testid="button-confirm-sale"
            >
              {createSaleMutation.isPending ? "Processing..." : "Complete Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
