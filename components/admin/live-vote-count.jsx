"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVoteUpdates } from "@/hooks/useSocket";
import { Trophy, Users, Wifi, WifiOff } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export function LiveVoteCount() {
  const [electionResults, setElectionResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle real-time vote updates
  const handleVoteUpdate = useCallback((data) => {
    if (data.results) {
      setElectionResults(data.results);
    }
  }, []);

  const { isConnected } = useVoteUpdates(handleVoteUpdate);

  // Fetch initial election results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get the most recent active election
        const electionsResponse = await fetch("/api/admin/elections");
        const elections = await electionsResponse.json();

        if (elections.length > 0) {
          const activeElection =
            elections.find((e) => e.isActive) || elections[0];

          const resultsResponse = await fetch(
            `/api/elections/${activeElection.id}/results`
          );
          const results = await resultsResponse.json();
          setElectionResults(results);
        }
      } catch (error) {
        console.error("Failed to fetch election results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!electionResults || !electionResults.results) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No election data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Live Vote Count - {electionResults.election.title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Badge variant="success" className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto space-y-4">
          {electionResults.results.map((categoryResult) => (
            <Card key={categoryResult.category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{categoryResult.category.displayName}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {categoryResult.totalVotes} votes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryResult.candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className={`p-4 rounded-lg border ${
                      index === 0 ? "bg-yellow-50 border-yellow-200" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative">
                        <Image
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                            <Trophy className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">
                            {candidate.name}
                          </p>
                          {index === 0 && (
                            <Badge className="bg-yellow-500">Winner</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {candidate.party || "Independent"}
                        </p>
                        {candidate.ballotNumber && (
                          <Badge variant="outline" className="mt-1">
                            Ballot #{candidate.ballotNumber}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{candidate.votes}</p>
                        <p className="text-sm text-muted-foreground">
                          {candidate.percentage}%
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={parseFloat(candidate.percentage)}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
