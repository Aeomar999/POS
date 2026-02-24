"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Poll for new notifications every 30 seconds
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    queryFn: () => apiRequest("GET", "/api/notifications").then((res) => res.json()),
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: async (id?: string) => {
      return apiRequest("PATCH", "/api/notifications/read", { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getIconColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-orange-500 bg-orange-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/50 h-9 w-9 border border-border/10 shadow-sm transition-all text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background border border-destructive-foreground/20 animate-in zoom-in">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 shadow-xl border-border/60" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/10">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{unreadCount} New</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={() => markReadMutation.mutate(undefined)}
              disabled={markReadMutation.isPending}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex gap-3 p-4 border-b last:border-0 transition-colors hover:bg-muted/30 cursor-default ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) markReadMutation.mutate(notification.id);
                  }}
                >
                  <div className={`mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${getIconColor(notification.type)}`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <p className={`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-foreground' : 'text-foreground/90'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center pt-1 font-medium">
                      {formatDistanceToNow(new Date(notification.createdAt!), { addSuffix: true })}
                      {notification.isRead && (
                        <span className="ml-2 flex items-center text-primary/60">
                          <Check className="h-3 w-3 mr-0.5" /> Read
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/5">
          <Button variant="outline" className="w-full text-xs h-8 shadow-sm">
            View All History
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
