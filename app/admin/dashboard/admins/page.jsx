import { AddAdminDialog } from "@/components/admin/add-admin-dialog";
import { AdminTable } from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/admins`,
    { cache: "no-store" }
  );
  const users = await response.json();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <AddAdminDialog />
      </div>

      <AdminTable admins={users} />
    </div>
  );
}
