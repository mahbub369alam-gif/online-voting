import { AddElectionDialog } from "@/components/admin/add-election-dialog";
import { ElectionTable } from "@/components/admin/election-table";

export const dynamic = "force-dynamic";

export default async function ElectionsPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections`,
    { cache: "no-store" }
  );
  const elections = await response.json();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Election Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage elections, assign candidates, and monitor voting.
          </p>
        </div>
        <AddElectionDialog />
      </div>

      <ElectionTable elections={elections} />
    </div>
  );
}
