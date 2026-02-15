"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Search, Trash, UserX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { EditVoterDialog } from "./edit-voter-modal";

export function VoterTable({ voters = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  if (!voters) return <div>Loading...</div>;

  const filteredVoters = voters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voterId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVoter = async (voterId) => {
    if (confirm("Are you sure you want to delete this voter?")) {
      const response = await fetch(`/api/admin/voters/${voterId}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        toast.error("Failed to delete voter");
      }
    }
  };

  const getVotingBadge = (hasVoted) => {
    return hasVoted ? (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Voted
      </Badge>
    ) : (
      <Badge variant="outline">Not Voted</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voter Management</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search voters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voter ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Voting Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVoters.map((voter) => (
                <TableRow key={voter.id}>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {voter.voterId}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Image
                      src={voter.imageUrl || "/placeholder-user.jpg"}
                      alt={voter.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{voter.name}</TableCell>
                  <TableCell>{voter.email || "N/A"}</TableCell>
                  <TableCell>{voter.phoneNumber}</TableCell>
                  <TableCell>{getVotingBadge(voter.hasVoted)}</TableCell>
                  <TableCell>{formatDate(voter.createdAt)}</TableCell>
                  <TableCell className="text-right overflow-visible flex gap-2">
                    <EditVoterDialog voter={voter} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-red-600 hover:text-white text-red-600 border border-red-600 rounded-full"
                      onClick={() => handleDeleteVoter(voter.id)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredVoters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No voters found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search terms</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
