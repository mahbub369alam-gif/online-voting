"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVoteUpdates } from "@/hooks/useSocket";
import { Trophy, Users, Wifi, WifiOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function ElectionResultsView({
  elections,
  selectedElectionId,
  resultsData: initialResultsData,
}) {
  const router = useRouter();
  const [resultsData, setResultsData] = useState(initialResultsData);

  // Handle real-time vote updates
  const handleVoteUpdate = useCallback(
    (data) => {
      console.log("📊 Election results received vote update:", data);
      if (data.results && data.results.election.id === selectedElectionId) {
        setResultsData(data.results);
      }
    },
    [selectedElectionId]
  );

  const { isConnected } = useVoteUpdates(handleVoteUpdate);

  // Update results when initial data changes
  useEffect(() => {
    setResultsData(initialResultsData);
  }, [initialResultsData]);

  const handleElectionChange = (electionId) => {
    router.push(`/admin/dashboard/results?election=${electionId}`);
  };

  if (!resultsData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Select an election to view results
          </p>
        </CardContent>
      </Card>
    );
  }

  const { election, results } = resultsData;

  return (
    <div className="space-y-6">
      {/* Election Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Select Election
              </label>
              <Select
                value={selectedElectionId}
                onValueChange={handleElectionChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an election" />
                </SelectTrigger>
                <SelectContent>
                  {elections.map((election) => (
                    <SelectItem key={election.id} value={election.id}>
                      {election.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Votes</p>
              <p className="text-3xl font-bold">{election.totalVotes}</p>
            </div>
            <div className="flex items-center">
              {isConnected ? (
                <Badge
                  variant="success"
                  className="bg-green-100 text-green-800"
                >
                  <Wifi className="h-3 w-3 mr-1" />
                  Live Updates
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-800"
                >
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results by Category */}
      <div className="space-y-6">
        {results.map((categoryResult) => (
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
    </div>
  );
}
