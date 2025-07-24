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
  const { auth, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "vip": return "text-gold";
      case "mvp": return "text-diamond";
      case "legend": return "text-emerald";
      default: return "text-muted-foreground";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-minecraft-green" />
              <span className="inline-block font-bold text-xl bg-minecraft-gradient bg-clip-text text-transparent">
                indusnetwork
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
              {auth.isAuthenticated && (
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
              )}
              {auth.user?.rank === "admin" && (
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
              )}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              {auth.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{auth.user?.username}</span>
                      {auth.user?.rank && auth.user.rank !== "default" && (
                        <Badge variant="outline" className={getRankColor(auth.user.rank)}>
                          {auth.user.rank.toUpperCase()}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/stats" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        My Stats
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setLoginModalOpen(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
              <Button size="sm" className="bg-minecraft-gradient hover:bg-minecraft-green">
                Join Server
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  );
}
