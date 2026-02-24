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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Pencil, Trash2, Users, Shield, UserCog, ShoppingBag, KeyRound, User, Briefcase, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User as UserType } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

const staffFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "manager", "sales"]),
  isActive: z.boolean(),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserType | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: staffUsers, isLoading } = useQuery<UserType[]>({
    queryKey: ["/api/staff"],
    queryFn: () => apiRequest("GET", "/api/staff").then((res) => res.json()),
  });

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "sales",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      return apiRequest("POST", "/api/staff", data);
    },
    onSuccess: () => {
      toast({ title: "Staff member added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: StaffFormData & { id: string }) => {
      return apiRequest("PATCH", `/api/staff/${data.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Staff member updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setIsDialogOpen(false);
      setEditingStaff(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/staff/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Staff member removed successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openCreateDialog = () => {
    setEditingStaff(null);
    form.reset({
      name: "",
      username: "",
      password: "",
      role: "sales",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (staff: UserType) => {
    setEditingStaff(staff);
    form.reset({
      name: staff.name,
      username: staff.username,
      password: "", // Leave blank so we don't overwrite if not changed in API logic
      role: staff.role as "admin" | "manager" | "sales",
      isActive: staff.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: StaffFormData) => {
    if (editingStaff) {
      updateMutation.mutate({ ...data, id: editingStaff.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredStaff = staffUsers?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "manager":
        return <UserCog className="h-4 w-4" />;
      case "sales":
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50";
      case "manager":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50";
      case "sales":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50";
      default:
        return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading tracking-tight" data-testid="text-staff-title">
            Team Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your staff, roles, and system access levels
          </p>
        </div>
        <Button onClick={openCreateDialog} data-testid="button-add-staff" className="h-10 px-6 font-semibold shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-sm">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-foreground">
                  {staffUsers?.filter((s) => s.role === "admin").length || 0}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Admin Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-sm">
                <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-foreground">
                  {staffUsers?.filter((s) => s.role === "manager").length || 0}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Manager Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate transition-all duration-200 shadow-sm border-border/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                <ShoppingBag className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-foreground">
                  {staffUsers?.filter((s) => s.role === "sales").length || 0}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Sales Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/80 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <Users className="h-5 w-5 text-primary" />
              User List
            </CardTitle>
            <div className="relative group sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background transition-all focus-visible:ring-primary/30"
                data-testid="input-search-staff"
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
          ) : !filteredStaff || filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/5 min-h-[300px]">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl" />
                <div className="bg-background rounded-full p-6 border border-border/50 shadow-sm relative">
                  <Users className="h-12 w-12 text-muted-foreground/40" />
                </div>
              </div>
              <p className="font-semibold text-lg text-foreground/80">No staff members found</p>
              <p className="text-sm mt-1 mb-6">You don't have any users matching your search.</p>
              <Button onClick={openCreateDialog} variant="outline" className="shadow-sm">
                Add New Staff Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold px-6">Staff Member</TableHead>
                    <TableHead className="font-semibold">Username</TableHead>
                    <TableHead className="font-semibold">Security Role</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="text-right font-semibold px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow
                      key={staff.id}
                      data-testid={`row-staff-${staff.id}`}
                      className="group hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border bg-background shadow-sm">
                            <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                              {getInitials(staff.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{staff.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{staff.role}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        @{staff.username}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] uppercase font-bold tracking-wider rounded border ${getRoleBadgeColor(staff.role)} gap-1.5 py-0.5`}
                        >
                          {getRoleIcon(staff.role)}
                          <span className="capitalize">{staff.role}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={staff.isActive ? "default" : "secondary"}
                          className={`text-[10px] uppercase font-bold tracking-wider rounded ${
                            staff.isActive ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-transparent shadow-none" : ""
                          }`}
                        >
                          {staff.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => openEditDialog(staff)}
                            data-testid={`button-edit-staff-${staff.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                            onClick={() => setDeleteConfirmId(staff.id)}
                            data-testid={`button-delete-staff-${staff.id}`}
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
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-border/80 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/5">
            <DialogTitle className="font-heading text-xl">
              {editingStaff ? "Edit Staff Profile" : "Register Team Member"}
            </DialogTitle>
            <DialogDescription>
              {editingStaff ? "Update the employee's details and access levels." : "Create an account for a new employee and assign their permissions."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-140px)] px-6 py-4">
            <Form {...form}>
              <form id="staff-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
                
                {/* Account Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <User className="h-4 w-4" /> Account Details
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                            <Input
                              {...field}
                              placeholder="e.g. Jane Smith"
                              className="pl-10"
                              data-testid="input-staff-name"
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
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                              <Input
                                {...field}
                                placeholder="janesmith"
                                className="pl-8 font-mono text-sm"
                                data-testid="input-staff-username"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {editingStaff ? "Reset Password" : "Login Password"}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                              <Input
                                {...field}
                                type="password"
                                placeholder={editingStaff ? "Leave blank to keep current" : "Secure password"}
                                className="pl-10"
                                data-testid="input-staff-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                    <Briefcase className="h-4 w-4" /> Permissions & Access
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-staff-role" className="h-12 bg-background">
                              <SelectValue placeholder="Select assigned role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1 rounded bg-purple-500/10">
                                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">Administrator</span>
                                  <span className="text-xs text-muted-foreground hidden sm:block">Full system control and user management</span>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="manager">
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1 rounded bg-blue-500/10">
                                  <UserCog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">Content Manager</span>
                                  <span className="text-xs text-muted-foreground hidden sm:block">Manage inventory, reports, and products</span>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="sales">
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1 rounded bg-emerald-500/10">
                                  <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">Sales Associate</span>
                                  <span className="text-xs text-muted-foreground hidden sm:block">Process transactions via POS interface</span>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status Section */}
                <div className="space-y-4 pt-2 pb-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4 hover:bg-muted/30 transition-colors">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-foreground font-semibold">Active Account Request</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Toggle off to temporarily suspend this user's access without deleting.
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                            data-testid="switch-staff-active"
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
              form="staff-form"
              className="px-6 font-semibold shadow-sm"
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-staff"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingStaff
                  ? "Save Changes"
                  : "Register Member"}
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
              Remove Staff Member
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-muted-foreground">
              Are you sure you want to permanently remove this user? They will immediately lose all system privileges. This action cannot be undone.
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
              data-testid="button-confirm-delete-staff"
            >
              {deleteMutation.isPending ? "Removing..." : "Permanently Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
