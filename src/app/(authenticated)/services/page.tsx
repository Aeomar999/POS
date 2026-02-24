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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Pencil, Trash2, Wrench, Clock, DollarSign, FileText, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Service } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

const serviceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  duration: z.string().optional(),
  isActive: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: () => apiRequest("GET", "/api/services").then((res) => res.json()),
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      return apiRequest("POST", "/api/services", data);
    },
    onSuccess: () => {
      toast({ title: "Service created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ServiceFormData & { id: string }) => {
      return apiRequest("PATCH", `/api/services/${data.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Service updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDialogOpen(false);
      setEditingService(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Service deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openCreateDialog = () => {
    setEditingService(null);
    form.reset({
      name: "",
      description: "",
      price: "",
      duration: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration || "",
      isActive: service.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      updateMutation.mutate({ ...data, id: editingService.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredServices = services?.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading tracking-tight" data-testid="text-services-title">
            Services Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your installation, maintenance, and training offerings
          </p>
        </div>
        <Button onClick={openCreateDialog} data-testid="button-add-service" className="h-10 px-6 font-semibold shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <Card className="shadow-sm border-border/80 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <Wrench className="h-5 w-5 text-primary" />
              Service Catalog
            </CardTitle>
            <div className="relative group sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search services by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background transition-all focus-visible:ring-primary/30"
                data-testid="input-search-services"
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
          ) : !filteredServices || filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/5 min-h-[300px]">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl" />
                <div className="bg-background rounded-full p-6 border border-border/50 shadow-sm relative">
                  <Wrench className="h-12 w-12 text-muted-foreground/40" />
                </div>
              </div>
              <p className="font-semibold text-lg text-foreground/80">No services found</p>
              <p className="text-sm mt-1 mb-6">You don't have any services matching your search.</p>
              <Button onClick={openCreateDialog} variant="outline" className="shadow-sm">
                Add Your First Service
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold w-[250px]">Service Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold text-center">Duration</TableHead>
                    <TableHead className="text-right font-semibold">Price</TableHead>
                    <TableHead className="text-center font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow
                      key={service.id}
                      data-testid={`row-service-${service.id}`}
                      className="group hover:bg-muted/20 transition-colors cursor-default"
                    >
                      <TableCell className="font-medium text-foreground py-4 align-top">
                        <div className="flex gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-md bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-600 dark:text-orange-400 mt-0.5">
                            <Wrench className="h-4 w-4" />
                          </div>
                          <span className="leading-tight mt-2 inline-block">{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-sm align-top pt-5">
                        <div className="line-clamp-2 leading-relaxed">
                          {service.description || <span className="italic opacity-50">No description provided</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-center align-top pt-5">
                        {service.duration ? (
                          <Badge variant="secondary" className="text-xs font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.duration} mins
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground opacity-50 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground align-top pt-5">
                        GH₵{Number(service.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center align-top pt-5">
                        <Badge
                          variant={service.isActive ? "default" : "secondary"}
                          className={`text-[10px] uppercase font-bold tracking-wider rounded ${
                            service.isActive ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-transparent shadow-none" : ""
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right align-top pt-3.5">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => openEditDialog(service)}
                            data-testid={`button-edit-service-${service.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                            onClick={() => setDeleteConfirmId(service.id)}
                            data-testid={`button-delete-service-${service.id}`}
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
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border/80 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/5">
            <DialogTitle className="font-heading text-xl">
              {editingService ? "Edit Service Details" : "Create New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service information below." : "Fill out the details to add a new service to your catalog."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-140px)] px-6 py-4">
            <Form {...form}>
              <form id="service-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
                
                {/* General Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <FileText className="h-4 w-4" /> Description
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                            <Input
                              {...field}
                              placeholder="e.g. CCTV Installation"
                              className="pl-10"
                              data-testid="input-service-name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Breakdown (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Detail what is included in this service..."
                            rows={4}
                            className="resize-none"
                            data-testid="input-service-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Details Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <Activity className="h-4 w-4" /> Details
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Fee</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">GH₵</span>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7 font-semibold"
                                data-testid="input-service-price"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Est. Duration (mins)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                              <Input
                                {...field}
                                placeholder="e.g. 60"
                                className="pl-9"
                                data-testid="input-service-duration"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div className="space-y-4 pt-2 pb-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4 hover:bg-muted/30 transition-colors">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-foreground font-semibold">Active Status</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Toggle off to hide this service from booking and sales.
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                            data-testid="switch-service-active"
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
              form="service-form"
              className="px-6 font-semibold shadow-sm"
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-service"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingService
                  ? "Save Changes"
                  : "Create Service"}
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
              <Trash2 className="h-5 w-5" />
              Delete Service
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-muted-foreground">
              Are you sure you want to permanently delete this service? This action cannot be undone and will remove it from future sales.
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
              data-testid="button-confirm-delete-service"
            >
              {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
