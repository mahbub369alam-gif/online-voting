"use client";

import { Card } from "@/components/ui/card";
import {
  Clock,
  Edit,
  FileEdit,
  List,
  Lock,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Total Candidate List",
      icon: Users,
      href: "/candidates",
    },
    {
      title: "Add New Candidate",
      icon: UserPlus,
      href: "/candidates",
    },
    {
      title: "Edit Candidate Details",
      icon: Edit,
      href: "/candidates",
    },
    {
      title: "Set Voting Time",
      icon: Clock,
      href: "/votings-time",
    },
    {
      title: "Add New Voter",
      icon: UserCheck,
      href: "/voters",
    },
    {
      title: "Change Password",
      icon: Lock,
      href: "/change-password",
    },
    {
      title: "Edit Voter Details",
      icon: FileEdit,
      href: "/voters",
    },
    {
      title: "Voter List",
      icon: List,
      href: "/voters",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Card key={index} className={`p-6 cursor-pointer transition-colors`}>
          <Link
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            href={`/admin/dashboard${action.href}`}
          >
            <action.icon size={48} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {action.title}
            </span>
          </Link>
        </Card>
      ))}
    </div>
  );
}
