"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addCandidate } from "@/lib/mock-data"
import { UserPlus } from "lucide-react"

const POLITICAL_PARTIES = [
  "Democratic Party",
  "Republican Party",
  "Independent",
  "Green Party",
  "Libertarian Party",
  "Other",
]

const POSITIONS = ["Mayor", "City Council", "Governor", "Senator", "Representative", "Judge", "Sheriff", "Other"]

export function AddCandidateDialog({ onCandidateAdded }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    position: "",
    bio: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError("Candidate name is required")
        return
      }

      if (!formData.party) {
        setError("Political party is required")
        return
      }

      if (!formData.position) {
        setError("Position is required")
        return
      }

      if (!formData.bio.trim()) {
        setError("Biography is required")
        return
      }

      // Create new candidate
      const newCandidate = addCandidate({
        ...formData,
        imageUrl: `/placeholder.svg?height=200&width=200&query=professional ${formData.name.toLowerCase().replace(/\s+/g, "-")} politician`,
      })

      if (newCandidate) {
        onCandidateAdded?.(newCandidate)
        setFormData({ name: "", party: "", position: "", bio: "" })
        setOpen(false)
      }
    } catch (err) {
      setError("Failed to add candidate. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Register a new candidate for the upcoming election. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter candidate's full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="party">Political Party</Label>
              <Select value={formData.party} onValueChange={(value) => handleInputChange("party", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select political party" />
                </SelectTrigger>
                <SelectContent>
                  {POLITICAL_PARTIES.map((party) => (
                    <SelectItem key={party} value={party}>
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Enter candidate's biography and qualifications"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide a brief description of the candidate's background and qualifications
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
