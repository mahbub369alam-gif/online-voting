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
import { generateVoterId } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddVoterDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    nidNumber: "",
    image: null,
    voterId: generateVoterId(),
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (formData.image) {
        if (formData.image.size > 2 * 1024 * 1024) {
          setError("Image size should be less than 2MB");
          toast.error("Image size should be less than 2MB");
          return;
        }
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("nidNumber", formData.nidNumber);
      submitData.append("voterId", formData.voterId);
      if (formData.image) submitData.append("image", formData.image);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/voters`,
        {
          method: "POST",
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const newVoter = await response.json();

      if (newVoter) {
        window.location.reload();
        toast.success("Voter added successfully!");
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          nidNumber: "",
          image: null,
          voterId: generateVoterId(),
        });
        setOpen(false);
      }
    } catch (err) {
      setError("Failed to add voter. Please try again.");
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
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
          <DialogDescription>
            Create a new voter account. The voter will receive their login
            credentials and voter ID.
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter voter's full name"
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
              <Label htmlFor="phoneNumber">Mobile Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter voter's Phone Number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nidNumber">NID Number</Label>
              <Input
                id="nidNumber"
                value={formData.nidNumber}
                onChange={(e) => handleInputChange("nidNumber", e.target.value)}
                placeholder="Enter voter's NID Number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) => handleInputChange("image", e.target.files[0])}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="voterId">
                Voter ID<span className="text-red-500">*</span>
              </Label>
              <Input
                id="voterId"
                value={formData.voterId}
                onChange={(e) => handleInputChange("voterId", e.target.value)}
                required
              />
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
              {isLoading ? "Adding..." : "Add Voter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
