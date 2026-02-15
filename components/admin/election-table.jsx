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
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import ManageElectionButtons from "./manage-election-buttons";

export function ElectionTable({ elections = [] }) {
  if (!elections) return <div>Loading...</div>;
  const getStatusBadge = (election) => {
    const now = new Date();
    const start = new Date(election.startTime);
    const end = new Date(election.endTime);

    if (!election.isActive) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Inactive
        </Badge>
      );
    }

    if (now < start) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Upcoming
        </Badge>
      );
    }

    if (now > end) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Ended
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Active
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.map((election) => (
                <TableRow key={election.id}>
                  <TableCell className="font-medium">
                    {election.title}
                  </TableCell>
                  <TableCell>{formatDate(election.startTime)}</TableCell>
                  <TableCell>{formatDate(election.endTime)}</TableCell>
                  <TableCell>{getStatusBadge(election)}</TableCell>
                  <TableCell>{election._count?.candidates || 0}</TableCell>
                  <TableCell>{election._count?.votes || 0}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Link href={`/admin/dashboard/elections/${election.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Manage Election"
                        className="p-0 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-600 rounded-full"
                      >
                        <Eye />
                      </Button>
                    </Link>
                    <ManageElectionButtons election={election} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
