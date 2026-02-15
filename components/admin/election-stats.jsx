"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ElectionStats({ election }) {
  // Group candidates by category
  const candidatesByCategory = election.candidates?.reduce(
    (acc, { candidate }) => {
      const categoryId = candidate.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: candidate.category,
          candidates: [],
        };
      }
      acc[categoryId].candidates.push(candidate);
      return acc;
    },
    {}
  );

  if (!candidatesByCategory || Object.keys(candidatesByCategory).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidates by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.values(candidatesByCategory).map(
            ({ category, candidates }) => (
              <div key={category.id}>
                <h3 className="font-semibold text-lg mb-3">
                  {category.displayName}: {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {candidates.length} candidates
                  </Badge>
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Ballot Number</TableHead>
                        <TableHead className="text-right">Votes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">
                            {candidate.name}
                          </TableCell>
                          <TableCell>
                            {candidate.party || "Independent"}
                          </TableCell>
                          <TableCell>{candidate.ballotNumber || "-"}</TableCell>
                          <TableCell className="text-right">
                            {candidate.votes || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
