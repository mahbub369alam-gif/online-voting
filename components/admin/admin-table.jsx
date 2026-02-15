"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Search, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditAdminDialog } from "./edit-admin-modal";

export function AdminTable({ admins = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  if (!admins) return <div>Loading...</div>;

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAdmin = async (adminId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        toast.error("Failed to delete user");
      }
    }
  };

  const getRoleBadge = (role) => {
    return role === "super-admin" ? (
      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
        Super Admin
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Admin
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell>{formatDate(admin.createdAt)}</TableCell>
                  <TableCell className="text-right overflow-visible flex gap-2 justify-end">
                    <EditAdminDialog admin={admin} />
                    {admin.role !== "super-admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 hover:bg-red-600 hover:text-white text-red-600 border border-red-600 rounded-full"
                        onClick={() => handleDeleteAdmin(admin.id)}
                      >
                        <Trash />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
