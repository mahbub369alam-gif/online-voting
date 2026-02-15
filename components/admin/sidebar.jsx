"use client";

import { logout } from "@/app/actions";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
  UserCheck,
  Users,
  Vote,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    accessibleFor: "admin",
  },
  {
    name: "Admin Management",
    href: "/admin/dashboard/admins",
    icon: User,
    accessibleFor: "super-admin",
  },
  {
    name: "Voter Management",
    href: "/admin/dashboard/voters",
    icon: Users,
    accessibleFor: "admin",
  },
  {
    name: "Candidate Management",
    href: "/admin/dashboard/candidates",
    icon: UserCheck,
    accessibleFor: "admin",
  },
  {
    name: "Election Management",
    href: "/admin/dashboard/elections",
    icon: Clock,
    accessibleFor: "admin",
  },
  {
    name: "Election Results",
    href: "/admin/dashboard/results",
    icon: BarChart3,
    accessibleFor: "admin",
  },
  {
    name: "Change Password",
    href: "/admin/dashboard/change-password",
    icon: Shield,
    accessibleFor: "admin",
  },
];

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role === "admin" && pathname.includes("/dashboard/admins")) {
          router.push("/admin/dashboard");
        }
        return setAuthenticatedUser(user);
      }
      return;
    }
  }, [user, isLoading]);

  const handleSignout = async () => {
    await logout();
    router.push("/admin");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <Vote className="h-8 w-8 text-primary mr-2" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation
              .filter((item) => {
                if (item.accessibleFor === "super-admin") {
                  return authenticatedUser?.role === "super-admin";
                }
                return (
                  authenticatedUser?.role === "admin" ||
                  authenticatedUser?.role === "super-admin"
                );
              })
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
          </nav>

          <Button
            size="sm"
            className="my-4 mx-4 bg-red-700 hover:bg-red-800 text-white px-3 py-2"
            onClick={handleSignout}
          >
            <LogOut />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
