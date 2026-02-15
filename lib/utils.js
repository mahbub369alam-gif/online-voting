import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })?.format(new Date(date));
};

export const formatTime = (date) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const isElectionActive = (election) => {
  const now = new Date();
  const start = new Date(election.startTime);
  const end = new Date(election.endTime);
  return now >= start && now <= end;
};

export const getElectionStatus = (election) => {
  const now = new Date();
  const start = new Date(election.startTime);
  const end = new Date(election.endTime);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateVoterId = () => {
  return "V" + Math.random().toString(36).substr(2, 6).toUpperCase();
};
