import { useAllVoters } from "@/hooks/useSocket";
import { getResultWithWidth } from "@/lib/getResultWithWidth";
import { formatDate } from "@/lib/utils";
import { EyeOff } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Separator } from "../ui/separator";

export function LiveVotingCount() {
  const [results, setResults] = useState(null);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle real-time vote updates
  const handleVoteUpdate = useCallback(
    (data) => {
      if (data.results && data.results.election.id === election?.id) {
        setResults(data?.results?.results);
      }
    },
    [election?.id]
  );

  const { isConnected } = useAllVoters(handleVoteUpdate);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/active`
      );
      const data = await response.json();

      const resultResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/${data.id}/results`
      );
      const resultData = await resultResponse.json();
      setResults(resultData.results);
      setElection({ ...data, ...resultData.election });
      setLoading(false);
    }
    fetchResults();
  }, []);

  if (election?.error == "No active election found") {
    return (
      <div className="text-center w-full h-[40vh] flex flex-col items-center justify-center gap-4">
        <EyeOff size={40} className="text-blue-500" />
        <h1 className="text-xl font-semibold text-gray-800 mb-6 px-10">
          No active election found
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center w-full h-[40vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-6 px-10">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <>
      <Separator />
      {/* Voting Time Notice */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          {election?.title}
        </h1>
        <p className="text-base font-medium text-gray-700">
          {/* show date with format */}
          You can Vote only {formatDate(election?.startTime)} to{" "}
          {formatDate(election?.endTime)}
        </p>
      </div>
      {election?.isLive ? (
        <div>
          {results?.map((categoryResult) => (
            <div key={categoryResult.category.id} className="mb-8">
              {/* Position Title */}
              <h3 className="text-center font-bold text-gray-800 mb-4 text-base">
                {categoryResult.category.displayName}
              </h3>

              {/* Candidates */}
              <div className="space-y-3">
                {getResultWithWidth(categoryResult.candidates).map(
                  (candidate) => (
                    <div key={candidate.id} className="">
                      <div
                        className="flex items-center justify-between bg-gray-500/30 p-3 rounded"
                        style={{
                          width: `${
                            candidate.width < 50 ? 50 : candidate.width
                          }%`,
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            className="w-6 h-6 rounded-full"
                            width={50}
                            height={50}
                          />
                          <span className="text-base text-gray-800 font-medium">
                            {candidate.name}
                          </span>
                        </div>
                        <span className="text-base font-semibold text-gray-700">
                          Vote: {candidate.votes}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center w-full h-[40vh] flex flex-col items-center justify-center gap-4">
          <EyeOff size={40} className="text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-800 mb-6 px-10">
            Live voting pannel hide from admin pannel. When voting time is end
            automatically show live voting pannel.
          </h1>
        </div>
      )}
    </>
  );
}
