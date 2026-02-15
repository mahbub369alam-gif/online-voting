"use client";

import { updateLiveStatus } from "@/app/actions";
import { CheckCircle, Trash, Wifi, WifiOff, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ManageElectionButtons({ election }) {
  const handleDeleteElection = async (electionId) => {
    if (confirm("Are you sure you want to delete this election?")) {
      const response = await fetch(`/api/admin/elections/${electionId}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete election");
      }
    }
  };

  const handleToggleActive = async (electionId, currentStatus) => {
    const response = await fetch(`/api/admin/elections/${electionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: !currentStatus }),
    });

    if (response.ok) {
      window.location.reload();
      toast.success(
        currentStatus ? "Election deactivated" : "Election activated"
      );
    } else {
      toast.error("Failed to update election status");
    }
  };

  const handleLiveStatus = async (electionId, currentStatus) => {
    const status = await updateLiveStatus(electionId, !currentStatus);
    if (status) {
      window.location.reload();
      return toast.success(
        currentStatus ? "Election deactivated" : "Election activated"
      );
    }
    if (status.error) return toast.error(status.error);

    return toast.error("Failed to update election status");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        title="Toggle Live Status"
        className={`p-0 border rounded-full hover:bg-teal-600 hover:text-white text-teal-600 border-teal-600`}
        onClick={() => handleLiveStatus(election.id, election.isLive)}
      >
        {election.isLive ? <Wifi /> : <WifiOff />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Toggle Active Status"
        className={`p-0 border rounded-full ${
          election.isActive
            ? "hover:bg-orange-600 hover:text-white text-orange-600 border-orange-600"
            : "hover:bg-green-600 hover:text-white text-green-600 border-green-600"
        }`}
        onClick={() => handleToggleActive(election.id, election.isActive)}
      >
        {election.isActive ? <XCircle /> : <CheckCircle />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Delete Election"
        className="p-0 hover:bg-red-600 hover:text-white text-red-600 border border-red-600 rounded-full"
        onClick={() => handleDeleteElection(election.id)}
      >
        <Trash />
      </Button>
    </>
  );
}
