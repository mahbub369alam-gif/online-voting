import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardContent } from "@/components/ui/card";
import { VotingProcess } from "@/components/voter/voting-process";
import { AlertCircle } from "lucide-react";

export default async function VotePage(props) {
  const searchParams = await props.searchParams;

  const {
    _params
  } = props;

  const voterId = searchParams.voterId;

  if (!voterId) {
    return <div>Invalid voter ID</div>;
  }

  const voterResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/voter/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId }),
    }
  );
  if (!voterResponse.ok) {
    return <div>Failed to verify voter ID</div>;
  }
  const voter = await voterResponse.json();

  // Fetch active election
  const electionResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/elections/active`,
    { cache: "no-store" }
  );

  const election = await electionResponse.json();

  const categoriesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/categories`,
    { cache: "no-store" }
  );
  if (!categoriesResponse.ok) {
    return <div>Failed to load categories</div>;
  }
  const categories = await categoriesResponse.json();

  return (
    <CardContent className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{election.title}</h1>
        <p className="text-muted-foreground">
          {election.description ||
            "Cast your vote for your preferred candidates"}
        </p>
      </div>

      {!election.isOpen ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Voting is currently closed. Please check back during the voting
            period.
          </AlertDescription>
        </Alert>
      ) : (
        <VotingProcess
          voter={voter}
          election={election}
          categories={categories}
        />
      )}
    </CardContent>
  );
}
