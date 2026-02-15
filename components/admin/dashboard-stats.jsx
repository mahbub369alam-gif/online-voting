"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Vote, Calendar } from "lucide-react"
import { mockUsers, mockCandidates, mockElections } from "@/lib/mock-data"

export function DashboardStats() {
  const totalVoters = mockUsers.filter((user) => user.role === "voter").length
  const verifiedVoters = mockUsers.filter((user) => user.role === "voter" && user.faceVerified).length
  const totalCandidates = mockCandidates.length
  const activeElections = mockElections.filter((election) => {
    const now = new Date()
    const start = new Date(election.startTime)
    const end = new Date(election.endTime)
    return now >= start && now <= end
  }).length

  const stats = [
    {
      title: "Total Voters",
      value: totalVoters,
      icon: Users,
      description: "Registered voters in system",
    },
    {
      title: "Verified Voters",
      value: verifiedVoters,
      icon: UserCheck,
      description: "Face-verified voters",
    },
    {
      title: "Candidates",
      value: totalCandidates,
      icon: Vote,
      description: "Total candidates registered",
    },
    {
      title: "Active Elections",
      value: activeElections,
      icon: Calendar,
      description: "Currently running elections",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
