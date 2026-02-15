import { AssignCandidates } from "@/components/admin/assign-candidates";
import ElectionSecurity from "@/components/admin/election-security";
import { ElectionStats } from "@/components/admin/election-stats";
import ManageElectionButtons from "@/components/admin/manage-election-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ElectionDetailsPage(props) {
  const params = await props.params;
  const { id } = params;

  const [electionRes, candidatesRes, categoriesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections/${id}`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/candidates`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/categories`, {
      cache: "no-store",
    }),
  ]);

  const election = await electionRes.json();
  const allCandidates = await candidatesRes.json();
  const categories = await categoriesRes.json();

  const votesRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/vote?electionId=${election.id}`,
    {
      cache: "no-store",
    }
  );
  const votes = await votesRes.json();

  election.candidates.forEach((candidate) => {
    const voteCount = votes.filter(
      (vote) => vote.candidateId === candidate.id
    ).length;
    candidate.votes = voteCount;
  });

  const getStatusBadge = () => {
    const now = new Date();
    const start = new Date(election.startTime);
    const end = new Date(election.endTime);

    if (!election.isActive) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Inactive
        </Badge>
      );
    }

    if (now < start) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Upcoming
        </Badge>
      );
    }

    if (now > end) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Ended
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Active
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/elections"
          className="hover:bg-gray-100 p-2 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {election.title}
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-muted-foreground mt-1">
            {election.description || "No description"}
          </p>
        </div>
        <div className="text-right flex gap-1 justify-end">
          <ElectionSecurity election={election} />
          <ManageElectionButtons election={election} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(election.startTime)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">End Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(election.endTime)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {election.candidates?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {election._count?.votes || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <ElectionStats election={election} />

      <AssignCandidates
        election={election}
        allCandidates={allCandidates}
        categories={categories}
      />
    </div>
  );
}
