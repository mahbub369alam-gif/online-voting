import { AdminSidebar } from "@/components/admin/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
