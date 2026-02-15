"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCandidates } from "@/lib/mock-data"
import { Users, Award, TrendingUp, Calendar } from "lucide-react"

export function CandidateStats() {
  const totalCandidates = mockCandidates.length
  const totalVotes = mockCandidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  const uniquePositions = new Set(mockCandidates.map((candidate) => candidate.position)).size
  const uniqueParties = new Set(mockCandidates.map((candidate) => candidate.party)).size

  const stats = [
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: Users,
      description: "Registered candidates",
      color: "text-blue-600",
    },
    {
      title: "Total Votes Cast",
      value: totalVotes,
      icon: TrendingUp,
      description: "Across all candidates",
      color: "text-green-600",
    },
    {
      title: "Positions",
      value: uniquePositions,
      icon: Award,
      description: "Different positions",
      color: "text-purple-600",
    },
    {
      title: "Political Parties",
      value: uniqueParties,
      icon: Calendar,
      description: "Represented parties",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
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
