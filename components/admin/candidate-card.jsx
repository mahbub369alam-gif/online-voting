"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteCandidate } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"
import { MoreHorizontal, Edit, Trash2, User, Calendar, Award } from "lucide-react"

export function CandidateCard({ candidate, onCandidateUpdated, onCandidateDeleted }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteCandidate = async () => {
    if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      setIsLoading(true)
      try {
        const deleted = deleteCandidate(candidate.id)
        if (deleted) {
          onCandidateDeleted?.(candidate.id)
        }
      } catch (error) {
        console.error("Failed to delete candidate:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <Badge variant="outline" className="text-xs">
                {candidate.party}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Candidate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleDeleteCandidate}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Candidate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Award className="h-4 w-4" />
          <span>Running for: {candidate.position}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{candidate.bio}</p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Added {formatDate(candidate.createdAt)}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{candidate.votes}</div>
            <div className="text-xs text-muted-foreground">votes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
