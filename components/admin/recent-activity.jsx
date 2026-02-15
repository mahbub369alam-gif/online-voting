"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, UserPlus, Users, Vote } from "lucide-react";

export function RecentActivity() {
  // Generate recent activity from mock data
  const activities = [
    {
      id: 1,
      type: "voter_registered",
      description: "New voter registered",
      user: "Jane Smith",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: UserPlus,
      status: "success",
    },
    {
      id: 2,
      type: "candidate_added",
      description: "New candidate added",
      user: "Alice Johnson",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: Users,
      status: "info",
    },
    {
      id: 3,
      type: "election_created",
      description: "Election scheduled",
      user: "City Mayor Election 2024",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      icon: Calendar,
      status: "warning",
    },
    {
      id: 4,
      type: "voter_verified",
      description: "Voter face verification completed",
      user: "John Doe",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: Vote,
      status: "success",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
              <div className="shrink-0 text-right">
                <Badge
                  variant="secondary"
                  className={getStatusColor(activity.status)}
                >
                  {formatDate(activity.timestamp)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
