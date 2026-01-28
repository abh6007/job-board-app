import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import logoPng from "../assets/logo.png";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.isAdmin;

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href} className={`
        text-sm font-medium transition-colors hover:text-primary
        ${isActive ? "text-primary font-bold" : "text-muted-foreground"}
      `}
      onClick={() => setIsOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold font-display text-primary">
            <img src={logoPng} alt="The Job News Logo" className="h-8 w-8 object-contain" />
            <span className="tracking-tight">The Job News</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/jobs">Jobs</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            {isAdmin && <NavLink href="/admin">Dashboard</NavLink>}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  Hi, {user.username}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logout()}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/jobs">Jobs</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          {isAdmin && <NavLink href="/admin">Dashboard</NavLink>}
          <div className="pt-4 border-t">
            {user ? (
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link href="/login" className="block w-full">
                <Button className="w-full gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
