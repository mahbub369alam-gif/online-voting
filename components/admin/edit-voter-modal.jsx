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
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function EditVoterDialog({ voter }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: voter.name,
    email: voter.email,
    phoneNumber: voter.phoneNumber,
    nidNumber: voter.nidNumber,
    image: null,
    voterId: voter.voterId,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check file size is more than 5MD or not
      if (formData.image && formData.image.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("nidNumber", formData.nidNumber);
      submitData.append("voterId", formData.voterId);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/voters/${voter.id}`,
        {
          method: "PUT",
          body: submitData,
        }
      );

      const newVoter = await response.json();

      if (!response.ok) {
        setError(newVoter.error);
        return;
      }

      if (newVoter) {
        window.location.reload();
        toast.success("Voter updated successfully!");
        setFormData({
          name: voter.name,
          email: voter.email,
          phoneNumber: voter.phoneNumber,
          nidNumber: voter.nidNumber,
          image: null,
          voterId: voter.voterId,
        });
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update voter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-600 rounded-full"
        >
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Voter</DialogTitle>
          <DialogDescription>Edit voter account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter voter's full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter voter's email address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">
                Mobile Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter voter's Phone Number"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nidNumber">
                NID Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="nidNumber"
                value={formData.nidNumber}
                onChange={(e) => handleInputChange("nidNumber", e.target.value)}
                placeholder="Enter voter's NID Number"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image (Leave empty to keep current)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange("image", e.target.files[0])}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="voterId">Voter ID</Label>
              <Input id="voterId" value={formData.voterId} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Editting..." : "Edit Voter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
