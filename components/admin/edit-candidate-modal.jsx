"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useState } from "react";

export function EditCandidateModal({ candidate, categories }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: candidate.name,
    party: candidate.party,
    categoryId: candidate.categoryId,
    bio: candidate.bio,
    ballotNumber: candidate.ballotNumber,
    image: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.categoryId) {
      setError("Name and category are required");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("party", formData.party);
      submitData.append("categoryId", formData.categoryId);
      submitData.append("bio", formData.bio);
      submitData.append("ballotNumber", formData.ballotNumber);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/candidates/${candidate.id}`,
        {
          method: "PUT",
          body: submitData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }

      const newCandidate = await response.json();

      if (!newCandidate?.id) {
        setError("Failed to update candidate. Please try again.");
        setIsLoading(false);
        return;
      }

      window.location.reload();
    } catch (err) {
      setError("Failed to add candidate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-full"
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
          <DialogDescription>
            Edit a candidate to the election system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter candidate name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="party">Political Party</Label>
              <Input
                id="party"
                placeholder="e.g., Democratic Party"
                value={formData.party}
                onChange={(e) => handleInputChange("party", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Category<span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.displayName} ({category.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ballotNumber">Ballot Number</Label>
            <Input
              id="ballotNumber"
              placeholder="Enter candidate Ballot Number"
              value={formData.ballotNumber}
              onChange={(e) =>
                handleInputChange("ballotNumber", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              placeholder="Brief biography of the candidate"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Profile Image (Leave empty to keep current)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange("image", e.target.files[0])}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
