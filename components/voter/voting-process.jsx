"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { CandidateSelection } from "./candidate-selection";
import { VoteConfirmation } from "./vote-confirmation";
import { VotingSuccess } from "./voting-success";

const VOTING_STEPS = {
  SELECTION: "selection",
  CONFIRMATION: "confirmation",
  SUCCESS: "success",
};

export function VotingProcess({ voter, election, categories }) {
  const [currentStep, setCurrentStep] = useState(VOTING_STEPS.SELECTION);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [voteDetails, setVoteDetails] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!voter) {
    return <div>Loading...</div>;
  }

  const getStepNumber = (step) => {
    switch (step) {
      case VOTING_STEPS.SELECTION:
        return 1;
      case VOTING_STEPS.CONFIRMATION:
        return 2;
      case VOTING_STEPS.SUCCESS:
        return 3;
      default:
        return 1;
    }
  };

  const getProgressValue = () => {
    return (getStepNumber(currentStep) / 3) * 100;
  };

  const handleVotesSelected = (votes) => {
    setSelectedVotes(votes);
    setCurrentStep(VOTING_STEPS.CONFIRMATION);
  };

  const handleGoBackToSelection = () => {
    setCurrentStep(VOTING_STEPS.SELECTION);
  };

  const handleVoteSubmission = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      // Convert selectedVotes to votes array
      const votes = Object.entries(selectedVotes).map(
        ([categoryId, candidateId]) => ({
          categoryId,
          candidateId,
        })
      );

      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterId: voter.id,
          electionId: election.id,
          votes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return setError(result.error);
      }

      setError("");
      setVoteDetails(result.results ?? result);
      setCurrentStep(VOTING_STEPS.SUCCESS);
    } catch (err) {
      console.log(err);
      setError(err?.message || "Failed to submit vote");
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      {currentStep !== VOTING_STEPS.SUCCESS && (
        <Card className="w-full bg-transparent max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {getStepNumber(currentStep)} of 3</span>
                <span>{Math.round(getProgressValue())}% Complete</span>
              </div>
              <Progress value={getProgressValue()} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Selection</span>
                <span>Confirmation</span>
                <span>Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="w-full max-w-2xl mx-auto">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentStep === VOTING_STEPS.SELECTION && (
        <CandidateSelection
          election={election}
          categories={categories}
          onVotesSelected={handleVotesSelected}
          selectedVotes={selectedVotes}
        />
      )}

      {currentStep === VOTING_STEPS.CONFIRMATION && (
        <VoteConfirmation
          election={election}
          selectedVotes={selectedVotes}
          categories={categories}
          onVoteSubmit={handleVoteSubmission}
          onGoBack={handleGoBackToSelection}
        />
      )}

      {currentStep === VOTING_STEPS.SUCCESS && voteDetails && (
        <VotingSuccess voteDetails={voteDetails} />
      )}
    </div>
  );
}
