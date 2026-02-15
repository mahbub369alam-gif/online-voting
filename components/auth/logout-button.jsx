"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton({ className }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button onClick={handleLogout} variant="ghost" className={className}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
