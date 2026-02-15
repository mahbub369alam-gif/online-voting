"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function AssignCandidates({ election, allCandidates, categories }) {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const assignedCandidateIds =
    election.candidates?.map((c) => c.candidateId) || [];
  const availableCandidates = allCandidates.filter(
    (c) => !assignedCandidateIds.includes(c.id)
  );

  const handleToggleCandidate = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleAssignCandidates = async () => {
    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections/${election.id}/candidates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ candidateIds: selectedCandidates }),
        }
      );

      if (response.ok) {
        toast.success("Candidates assigned successfully");
        window.location.reload();
      } else {
        toast.error("Failed to assign candidates");
      }
    } catch (error) {
      toast.error("Failed to assign candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections/${election.id}/candidates`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ candidateId }),
        }
      );

      if (response.ok) {
        toast.success("Candidate removed successfully");
        window.location.reload();
      } else {
        toast.error("Failed to remove candidate");
      }
    } catch (error) {
      toast.error("Failed to remove candidate");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.displayName || "Unknown";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Assigned Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>
            Assigned Candidates ({election.candidates?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {election.candidates?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No candidates assigned yet
              </p>
            ) : (
              election.candidates?.map(({ candidate }) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Image
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.party || "Independent"}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {getCategoryName(candidate.categoryId)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCandidate(candidate.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {availableCandidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No available candidates
              </p>
            ) : (
              availableCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    className="border border-teal-400"
                    checked={selectedCandidates.includes(candidate.id)}
                    onCheckedChange={() => handleToggleCandidate(candidate.id)}
                  />
                  <Image
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.party || "Independent"}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {getCategoryName(candidate.categoryId)}
                  </Badge>
                </div>
              ))
            )}
          </div>
          {availableCandidates.length > 0 && (
            <Button
              onClick={handleAssignCandidates}
              disabled={selectedCandidates.length === 0 || isLoading}
              className="w-full mt-4"
            >
              {isLoading
                ? "Assigning..."
                : `Assign ${selectedCandidates.length} Candidate${
                    selectedCandidates.length !== 1 ? "s" : ""
                  }`}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
