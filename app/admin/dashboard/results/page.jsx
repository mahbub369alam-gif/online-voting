import { ElectionResultsView } from "@/components/admin/election-results-view";

export const dynamic = "force-dynamic";

export default async function ResultsPage(props) {
  const searchParams = await props.searchParams;
  const electionsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections`,
    { cache: "no-store" }
  );
  const elections = await electionsResponse.json();

  // Get selected election ID from query params or use the most recent
  const selectedElectionId = searchParams.election || elections[0]?.id;

  let resultsData = null;
  if (selectedElectionId) {
    const resultsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/elections/${selectedElectionId}/results`,
      { cache: "no-store" }
    );

    if (resultsResponse.ok) {
      resultsData = await resultsResponse.json();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Election Results</h1>
        <p className="text-muted-foreground">
          View detailed results and analytics for elections
        </p>
      </div>

      {elections.length === 0 ? (
        <p className="text-muted-foreground">No elections found</p>
      ) : (
        <ElectionResultsView
          elections={elections}
          selectedElectionId={selectedElectionId}
          resultsData={resultsData}
        />
      )}
    </div>
  );
}
