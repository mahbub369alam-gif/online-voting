"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, User } from "lucide-react";
import { useState } from "react";

export function CandidateSelection({
  election,
  categories,
  onVotesSelected,
  selectedVotes,
}) {
  // Store selected candidates by category
  const [votes, setVotes] = useState(selectedVotes || {});

  // Group candidates by category
  const candidatesByCategory = election.candidates.reduce(
    (acc, { candidate }) => {
      if (!acc[candidate.categoryId]) {
        acc[candidate.categoryId] = [];
      }
      acc[candidate.categoryId].push(candidate);
      return acc;
    },
    {}
  );

  const handleVote = (candidateId, categoryId) => {
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

  // Check if all categories have been voted for
  const allCategoriesVoted =
    Object.keys(votes).length === Object.keys(candidatesByCategory).length;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-transparent border border-black/20 rounded-lg p-0">
      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center bg-black/10 relative p-4">
          <div className="font-bold text-black">Name</div>
          <div className="font-bold text-black">Ballot No/Image</div>
          <div className="font-bold text-black">Vote</div>
        </div>

        <div className="p-4">
          {/* Candidates by Position */}
          {Object.entries(candidatesByCategory).map(
            ([categoryId, candidates]) => {
              const category = categories.find((c) => c.id === categoryId);

              return (
                <div key={categoryId} className="mb-8">
                  {/* Position Title */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-transparent border border-black/50 rounded px-8 py-3">
                      <span className="text-black text-xl font-bold">
                        {category.displayName || category.name}
                      </span>
                    </div>
                  </div>

                  {/* Candidates List */}
                  <div className="space-y-3 mb-6">
                    {candidates.map((candidate, index) => {
                      const isSelected = votes[categoryId] === candidate.id;

                      return (
                        <div
                          key={candidate.id}
                          className={`
                        relative flex items-center justify-between p-4 rounded-lg border border-black/30
                        ${
                          isSelected
                            ? "bg-black/60 shadow-lg shadow-gray-600/60"
                            : "bg-black/20"
                        }
                        transition-all duration-200
                      `}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={candidate.imageUrl}
                              alt={candidate.name}
                            />
                            <AvatarFallback className="bg-purple-700 text-white">
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>

                          {/* Candidate Name */}
                          <div className="flex-1 text-left ml-2">
                            <span className="text-white text-lg font-normal">
                              {candidate.name}
                            </span>
                          </div>

                          {/* Ballot Number */}
                          <div className="flex-1 text-center">
                            <span className="text-white text-lg font-medium">
                              {candidate.ballotNumber || `N/A`}
                            </span>
                          </div>

                          {/* Vote Button/Check */}
                          <div className="flex-1 text-right">
                            {isSelected ? (
                              <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full border-2 border-black/30">
                                <Check className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <Button
                                onClick={() =>
                                  handleVote(candidate.id, categoryId)
                                }
                                className="bg-purple-500/40 hover:bg-purple-500/60 text-black font-medium text-lg px-6 py-2 rounded border border-black/50"
                              >
                                Vote
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center mt-8 pb-4">
          <Button
            onClick={handleContinue}
            disabled={!allCategoriesVoted}
            className={`h-12 font-semibold py-3 rounded mb-8 text-lg border border-black/30 ${
              allCategoriesVoted
                ? "bg-purple-500/60 hover:bg-purple-500/80 cursor-pointer text-black"
                : "bg-gray-400/60 cursor-not-allowed text-gray-600"
            }`}
          >
            {allCategoriesVoted
              ? "Continue to Vote Confirmation"
              : `Please vote for all categories (${Object.keys(votes).length}/${
                  Object.keys(candidatesByCategory).length
                })`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
