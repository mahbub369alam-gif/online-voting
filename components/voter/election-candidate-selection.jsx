"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function ElectionCandidateSelection({
  election,
  categories,
  onVotesSelected,
  selectedVotes,
}) {
  const [votes, setVotes] = useState(selectedVotes || {});

  // Group candidates by category
  const candidatesByCategory = election.candidates.reduce((acc, candidate) => {
    if (!acc[candidate.categoryId]) {
      acc[candidate.categoryId] = [];
    }
    acc[candidate.categoryId].push(candidate);
    return acc;
  }, {});

  const handleCandidateSelect = (categoryId, candidateId) => {
    setVotes((prev) => ({
      ...prev,
      [categoryId]: candidateId,
    }));
  };

  const handleContinue = () => {
    // Check if all categories have a vote
    const categoriesWithCandidates = Object.keys(candidatesByCategory);
    const allCategoriesVoted = categoriesWithCandidates.every(
      (catId) => votes[catId]
    );

    if (!allCategoriesVoted) {
      alert("Please select one candidate from each category");
      return;
    }

    onVotesSelected(votes);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Select Your Candidates
            <p className="text-sm font-normal text-muted-foreground mt-2">
              Choose one candidate from each category
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(candidatesByCategory).map(
            ([categoryId, candidates]) => {
              const category = categories.find((c) => c.id === categoryId);
              const selectedCandidate = votes[categoryId];

              return (
                <div key={categoryId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {category?.displayName || "Category"}
                    </h3>
                    {selectedCandidate && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>

                  <RadioGroup
                    value={selectedCandidate}
                    onValueChange={(value) =>
                      handleCandidateSelect(categoryId, value)
                    }
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      {candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                            selectedCandidate === candidate.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem
                            value={candidate.id}
                            id={candidate.id}
                            className="mt-0"
                          />
                          <Label
                            htmlFor={candidate.id}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <Image
                              src={candidate.imageUrl}
                              alt={candidate.name}
                              width={50}
                              height={50}
                              className="rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {candidate.party || "Independent"}
                              </p>
                              {candidate.ballotNumber && (
                                <Badge variant="outline" className="mt-1">
                                  #{candidate.ballotNumber}
                                </Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              );
            }
          )}

          <Button
            onClick={handleContinue}
            className="w-full"
            size="lg"
            disabled={
              Object.keys(votes).length !==
              Object.keys(candidatesByCategory).length
            }
          >
            Continue to Confirmation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
