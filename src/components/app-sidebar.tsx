import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingCart,
  Users,
  BarChart3,
  Boxes,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@shared/schema";

interface AppSidebarProps {
  staffUser?: User | null;
}

export function AppSidebar({ staffUser }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const role = staffUser?.role || "sales";

  const mainNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "manager", "sales"],
    },
    {
      title: "Point of Sale",
      url: "/pos",
      icon: ShoppingCart,
      roles: ["admin", "manager", "sales"],
    },
  ];

  const inventoryNavItems = [
    {
      title: "Products",
      url: "/products",
      icon: Package,
      roles: ["admin", "manager"],
    },
    {
      title: "Services",
      url: "/services",
      icon: Wrench,
      roles: ["admin", "manager"],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Boxes,
      roles: ["admin", "manager"],
    },
  ];

  const adminNavItems = [
    {
      title: "Staff Management",
      url: "/staff",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Sales Reports",
      url: "/reports",
      icon: BarChart3,
      roles: ["admin", "manager"],
    },
  ];

  const filterByRole = (items: typeof mainNavItems) =>
    items.filter((item) => item.roles.includes(role));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-1 relative group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg shadow-sm border border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm font-heading tracking-tight">Silicon POS</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Enterprise System</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByRole(mainNavItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => router.push(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filterByRole(inventoryNavItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Inventory</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(inventoryNavItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => router.push(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filterByRole(adminNavItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(adminNavItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => router.push(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              data-testid="button-user-menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {staffUser?.name ? getInitials(staffUser.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {staffUser?.name || user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground capitalize group-hover:text-sidebar-accent-foreground/70 transition-colors">
                  {role}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-sidebar-accent-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => logout()}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
