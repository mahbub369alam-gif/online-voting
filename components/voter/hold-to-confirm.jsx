import { useEffect, useRef, useState } from "react";

export function HoldToConfirm({ onHoldComplete, totalVotes }) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const holdTime = 5000; // 5 seconds
  const radius = 105;
  const circumference = 2 * Math.PI * radius;

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const holdingRef = useRef(false);
  const firedRef = useRef(false);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startHold = () => {
    if (completed) return;
    if (holdingRef.current) return;

    holdingRef.current = true;
    firedRef.current = false;
    startTimeRef.current = Date.now();

    // start from tiny progress so effect renders
    setProgress(1);

    clearTick();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const next = Math.min(100, (elapsed / holdTime) * 100);
      setProgress(next);
    }, 50);
  };

  const stopHold = () => {
    if (!holdingRef.current) return;

    holdingRef.current = false;
    clearTick();

    if (!completed) {
      setProgress(0);
    }
  };

  // Fire complete safely (NOT inside setState updater)
  useEffect(() => {
    if (!completed && progress >= 100 && !firedRef.current) {
      firedRef.current = true;
      setCompleted(true);
      holdingRef.current = false;
      clearTick();

      // call after state flush
      Promise.resolve().then(() => onHoldComplete?.());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, completed]);

  // cleanup
  useEffect(() => {
    return () => clearTick();
  }, []);

  const strokeDashoffset = completed
    ? 0
    : circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className="relative w-48 h-48 cursor-pointer select-none rounded-full border-2 border-purple-500"
        style={{ touchAction: "none" }} // IMPORTANT for mobile
        // Pointer events (best for mobile + desktop)
        onPointerDown={(e) => {
          e.preventDefault();
          startHold();
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          stopHold();
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          stopHold();
        }}
        onPointerLeave={(e) => {
          e.preventDefault();
          stopHold();
        }}
        // Fallback touch events (older iOS)
        onTouchStart={(e) => {
          e.preventDefault();
          startHold();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          stopHold();
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          stopHold();
        }}
      >
        {/* Circular progress border */}
        <svg
          className="transform -rotate-90"
          width="100%"
          height="100%"
          viewBox="0 0 250 250"
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
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
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
