"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCandidates } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Award, CheckCircle, Home, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function VotingSuccess({ voteDetails }) {
  const router = useRouter();

  // Get voted candidates from voteDetails
  const votedCandidates = Object.values(voteDetails.selectedCandidates || {})
    .map((candidateId) => mockCandidates.find((c) => c.id === candidateId))
    .filter(Boolean);

  return (
    <Card className="w-full bg-transparent max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <CardTitle className="text-2xl text-green-600">
          Votes Submitted Successfully!
        </CardTitle>
        <CardDescription>
          Your votes have been recorded and cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voted Candidates Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            Your Voted Candidates
          </h3>
          <div className="grid gap-3">
            {votedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={candidate.imageUrl}
                      alt={candidate.name}
                    />
                    <AvatarFallback className="bg-green-500 text-white">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">
                      {candidate.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <Award className="h-3 w-3 text-green-600" />
                      <span className="text-green-700 font-medium">
                        {candidate.position}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs border-green-300 text-green-700"
                      >
                        {candidate.party}
                      </Badge>
                    </div>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vote Details */}
        <div className="bg-white/30 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Vote ID:</span>
            <Badge variant="outline" className="font-mono">
              #{voteDetails.id}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Submitted:</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(voteDetails.timestamp)}
            </span>
          </div>
        </div>

        <div className="space-y-3 flex justify-center">
          <Button
            onClick={() => router.push("/")}
            className="h-12 bg-green-500 hover:bg-green-600 font-semibold py-3 rounded text-lg"
          >
            <Home />
            Return to Dashboard
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Keep your vote ID for your records.</p>
          <p>Thank you for participating in the democratic process!</p>
        </div>
      </CardContent>
    </Card>
  );
}
