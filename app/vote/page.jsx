"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function VotePage() {
  const [voterId, setVoterId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [electionId, setElectionId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterId,
          candidateId,
          electionId,
          categoryId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Vote cast successfully!");
        // Reset form
        setVoterId("");
        setCandidateId("");
        setElectionId("");
        setCategoryId("");
      } else {
        toast.error(result.error || "Failed to cast vote");
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("An error occurred while casting vote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVote} className="space-y-4">
              <div>
                <Label htmlFor="voterId">Voter ID</Label>
                <Input
                  id="voterId"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  placeholder="Enter voter ID"
                  required
                />
              </div>

              <div>
                <Label htmlFor="candidateId">Candidate ID</Label>
                <Input
                  id="candidateId"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  placeholder="Enter candidate ID"
                  required
                />
              </div>

              <div>
                <Label htmlFor="electionId">Election ID</Label>
                <Input
                  id="electionId"
                  value={electionId}
                  onChange={(e) => setElectionId(e.target.value)}
                  placeholder="Enter election ID"
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category ID</Label>
                <Input
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Enter category ID"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Casting Vote..." : "Cast Vote"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Test Data</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p>
              <strong>Sample Voter ID:</strong> Use any existing voter ID from
              your database
            </p>
            <p>
              <strong>Sample Candidate ID:</strong> Use any existing candidate
              ID
            </p>
            <p>
              <strong>Sample Election ID:</strong> Use any existing election ID
            </p>
            <p>
              <strong>Sample Category ID:</strong> Use any existing category ID
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
