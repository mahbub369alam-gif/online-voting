"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function CandidateFilters({
  searchTerm,
  setSearchTerm,
  selectedParty,
  setSelectedParty,
  selectedPosition,
  setSelectedPosition,
  parties,
  positions,
}) {
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedParty("all")
    setSelectedPosition("all")
  }

  const hasActiveFilters = searchTerm || selectedParty !== "all" || selectedPosition !== "all"

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={selectedParty} onValueChange={setSelectedParty}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by party" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Parties</SelectItem>
          {parties.map((party) => (
            <SelectItem key={party} value={party}>
              {party}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedPosition} onValueChange={setSelectedPosition}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Positions</SelectItem>
          {positions.map((position) => (
            <SelectItem key={position} value={position}>
              {position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  )
}
