import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shield, User, ShoppingCart, Settings, BarChart3, LogOut } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "./auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-minecraft-green" />
            <span className="inline-block font-bold text-xl bg-minecraft-gradient bg-clip-text text-transparent">
              IndusMC
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                isActive("/") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link>
            <Link
              to="/store"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                isActive("/store") ? "text-foreground" : "text-foreground/60"
              )}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Store
            </Link>
            <Link
              to="/stats"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                isActive("/stats") ? "text-foreground" : "text-foreground/60"
              )}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Stats
            </Link>
            <Link
              to="/admin"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                isActive("/admin") ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Settings className="h-4 w-4 mr-1" />
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-minecraft-gradient hover:bg-minecraft-green">
              Join Server
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
