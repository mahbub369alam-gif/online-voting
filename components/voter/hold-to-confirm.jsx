import { useEffect, useState } from "react";

export function HoldToConfirm({ onHoldComplete, totalVotes }) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const holdTime = 5000; // 5 seconds
  const radius = 105;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let interval;
    if (progress > 0 && progress < 100) {
      const step = 100 / (holdTime / 100);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev + step >= 100) {
            clearInterval(interval);
            onHoldComplete();
            setCompleted(true);
            return 100;
          }
          return prev + step;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [progress]);

  const handleMouseDown = () => setProgress(1);
  const handleMouseUp = () => setProgress(0);
  const handleMouseLeave = () => setProgress(0);

  const strokeDashoffset = completed
    ? 0
    : circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className="relative w-48 h-48 cursor-pointer select-none rounded-full border-2 border-purple-500"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Circular progress border */}
        <svg
          className="transform -rotate-90"
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
        >
          <circle
            cx="125"
            cy="125"
            r={radius}
            stroke="#ede9fe"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="125"
            cy="125"
            r={radius}
            stroke="#8b5cf6"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>

        {/* Inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-purple-600 font-bold text-lg">
            {completed ? "VOTES CONFIRMED" : "CONFIRM VOTES"}
          </span>
          <span className="text-gray-600 text-sm">
            {completed
              ? "Submitted!"
              : progress > 0
              ? `Hold for ${(5 - progress / 20).toFixed(1)}s`
              : `Hold to submit ${totalVotes} votes`}
          </span>
        </div>
      </div>
    </div>
  );
}
