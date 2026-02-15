"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Hand, Info, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HoldToConfirm } from "./hold-to-confirm";

export function VoteConfirmation({
  election,
  selectedVotes,
  categories,
  candidates,
  selectedCandidateId, // This is now an array of candidate IDs
  onVoteSubmit,
  onGoBack,
}) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const holdTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  // Get all selected candidates from the array
  const getSelectedCandidates = () => {
    return Object.entries(selectedVotes).map(([categoryId, candidateId]) => {
      const category = categories.find((c) => c.id === categoryId);
      const candidate = election.candidates.find(
        (c) => c.candidateId === candidateId
      );
      return { category, candidate: candidate.candidate };
    });
  };

  const selectedCandidates = getSelectedCandidates();

  const HOLD_DURATION = 5000; // 5 seconds

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const startHold = () => {
    if (isSubmitting) return;

    setIsHolding(true);
    setHoldProgress(0);

    // Progress animation
    progressTimerRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const newProgress = prev + 100 / (HOLD_DURATION / 100);
        return Math.min(newProgress, 100);
      });
    }, 100);

    // Submit all votes after 5 seconds
    holdTimerRef.current = setTimeout(() => {
      setIsSubmitting(true);
      onVoteSubmit(selectedCandidateId);
    }, HOLD_DURATION);
  };

  const stopHold = () => {
    if (isSubmitting) return;

    setIsHolding(false);
    setHoldProgress(0);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
  };

  if (!selectedCandidates.length) {
    return null;
  }

  return (
    <Card className="w-full bg-transparent max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Confirm Your Votes</CardTitle>
        <CardDescription>
          Review your selected candidates and hold down the confirmation area
          for 5 seconds to submit all votes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-transparent">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Once you submit your votes, they cannot
            be changed or withdrawn.
          </AlertDescription>
        </Alert>

        {/* Selected Candidates Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-4">
            Your Selected Candidates
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {selectedCandidates.map(({ category, candidate }) => (
              <div
                key={candidate.id}
                className="border rounded-lg p-4 bg-muted/30"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={candidate.imageUrl}
                      alt={candidate.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{candidate.name}</h4>
                      {candidate.ballotNumber && (
                        <span className="text-sm text-muted-foreground">
                          #{candidate.ballotNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Award className="h-3 w-3" />
                      <span>{candidate.position}</span>
                      <Badge variant="outline" className="text-xs">
                        {candidate.party || "Independent"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hold to Vote Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Hand className="h-4 w-4" />
            <span>
              Hold the confirmation area below for 5 seconds to submit all your
              votes
            </span>
          </div>

          <HoldToConfirm
            onHoldComplete={() => onVoteSubmit(selectedCandidateId)}
            totalVotes={selectedCandidates.length}
          />
        </div>

        {/* Back button */}
        <div className="pt-4 border-t flex justify-center">
          <Button
            onClick={onGoBack}
            className="h-12 bg-green-500 hover:bg-green-600 font-semibold py-3 rounded mb-8 text-lg"
            disabled={isSubmitting}
          >
            Go Back to Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
