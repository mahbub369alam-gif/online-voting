"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LiveVotingCount } from "@/components/voter/live-voting-count";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [voterId, setVoterId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (!voterId) {
      setError("Please enter your voter ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/voter/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voterId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify voter ID");
      }

      router.push(`/voter?voterId=${voterId}`);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          আপনার আইডি নম্বর দিন
        </h1>

        {/* Voter ID Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="ID TYPE: XXXXXXX.................."
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="w-2/3 mx-auto h-12 p-4 text-center bg-transparent border border-black rounded-lg text-lg"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="w-50 h-12 bg-green-500 hover:bg-green-600 font-semibold py-3 rounded mb-8 text-lg"
        >
          {isLoading ? "Verifying..." : "NEXT"}
        </Button>
      </div>

      {/* Live Voting section */}
      <LiveVotingCount />
    </CardContent>
  );
}
