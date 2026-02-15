import { AddVoterDialog } from "@/components/admin/add-voter-dialog";
import AddVoterWithExcel from "@/components/admin/add-voter-with-excel";
import { VoterTable } from "@/components/admin/voter-table";

export const dynamic = "force-dynamic";

export default async function VotersPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/voters`,
    { cache: "no-store" }
  );
  const voters = await response.json();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Voter Management
          </h1>
          <p className="text-muted-foreground">
            Manage voter registrations, verifications, and account settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddVoterWithExcel />
          <AddVoterDialog />
        </div>
      </div>
      <VoterTable voters={voters} />
    </div>
  );
}
