import { LiveVoteCount } from "@/components/admin/live-vote-count";
import { QuickActions } from "@/components/admin/quick-actions";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage elections, voters, and candidates from your central dashboard.
        </p>
      </div>

      <QuickActions />
      <LiveVoteCount />
    </div>
  );
}
