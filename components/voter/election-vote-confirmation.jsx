"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ElectionVoteConfirmation({
  election,
  selectedVotes,
  categories,
  onVoteSubmit,
  onGoBack,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onVoteSubmit();
    setIsSubmitting(false);
  };

  const getSelectedCandidates = () => {
    return Object.entries(selectedVotes).map(([categoryId, candidateId]) => {
      const category = categories.find((c) => c.id === categoryId);
      const candidate = election.candidates.find((c) => c.id === candidateId);
      return { category, candidate };
    });
  };

  const selectedCandidates = getSelectedCandidates();

  return (
    <div className="space-y-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Confirm Your Votes
            <p className="text-sm font-normal text-muted-foreground mt-2">
              Please review your selections carefully before submitting
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Once you submit your vote, it cannot be changed. Make sure you
              have selected the right candidates.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {selectedCandidates.map(({ category, candidate }) => (
              <div
                key={category.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Image
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {category.displayName}
                  </p>
                  <p className="font-semibold text-lg">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.party || "Independent"}
                  </p>
                </div>
                {candidate.ballotNumber && (
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{candidate.ballotNumber}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onGoBack}
              className="flex-1"
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit My Vote"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
