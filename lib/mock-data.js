// Mock data structure to simulate database without external integration

export const mockUsers = [
  {
    id: 1,
    email: "admin@evoting.gov",
    password: "admin123", // In real app, this would be hashed
    role: "admin",
    name: "System Administrator",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    email: "voter1@email.com",
    password: "voter123",
    role: "voter",
    name: "John Doe",
    voterId: "V001",
    hasVoted: false,
    faceVerified: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 3,
    email: "voter2@email.com",
    password: "voter123",
    role: "voter",
    name: "Jane Smith",
    voterId: "V002",
    hasVoted: true,
    faceVerified: true,
    createdAt: new Date("2024-01-16"),
  },
];

// Categories for candidates
export const mockCategories = [
  {
    id: 1,
    name: "VP",
    displayName: "Vice President",
    description: "Vice President position candidates",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "GS",
    displayName: "General Secretary",
    description: "General Secretary position candidates",
    createdAt: new Date("2024-01-01"),
  },
];

export const mockCandidates = [
  {
    id: 1,
    name: "Mahbub Alam",
    party: "Democratic Party",
    position: "VP",
    bio: "Experienced leader with 10 years of public service.",
    imageUrl: "/professional-man-politician.jpg",
    votes: 12423523,
    candidateId: "00001001",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 2,
    name: "Tanvir Hossain",
    party: "Republican Party",
    position: "VP",
    bio: "Local business owner focused on economic development.",
    imageUrl: "/professional-man-politician.jpg",
    votes: 2423523,
    candidateId: "00001002",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 3,
    name: "Tahmid Khan",
    party: "Independent",
    position: "VP",
    bio: "Community activist advocating for development.",
    imageUrl: "/professional-man-politician.jpg",
    votes: 124235,
    candidateId: "00001003",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 4,
    name: "Mahbub Alam",
    party: "Progressive Party",
    position: "GS",
    bio: "Experienced administrator and public servant.",
    imageUrl: "/professional-man-politician.jpg",
    votes: 12423,
    candidateId: "00001001",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 5,
    name: "Prosenjit",
    party: "Liberal Party",
    position: "GS",
    bio: "Young leader with fresh ideas.",
    imageUrl: "/professional-man-politician.jpg",
    votes: 124,
    candidateId: "00001002",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 6,
    name: "Mahbub Alam",
    party: "Conservative Party",
    position: "GS",
    bio: "Veteran politician with proven track record.",
    imageUrl: "/professional-man-politician.jpg",
    votes: 120,
    candidateId: "00001003",
    createdAt: new Date("2024-02-01"),
  },
];

// Helper functions for categories
export const addCategory = (categoryData) => {
  const newCategory = {
    id: mockCategories.length + 1,
    ...categoryData,
    createdAt: new Date(),
  };
  mockCategories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id, updates) => {
  const categoryIndex = mockCategories.findIndex(
    (category) => category.id === id
  );
  if (categoryIndex !== -1) {
    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...updates,
    };
    return mockCategories[categoryIndex];
  }
  return null;
};

export const deleteCategory = (id) => {
  const categoryIndex = mockCategories.findIndex(
    (category) => category.id === id
  );
  if (categoryIndex !== -1) {
    return mockCategories.splice(categoryIndex, 1)[0];
  }
  return null;
};

export const mockElections = [
  {
    id: 1,
    title: "City Mayor Election 2024",
    description: "Annual election for the position of City Mayor",
    startTime: new Date("2024-03-01T08:00:00"),
    endTime: new Date("2026-03-01T20:00:00"),
    status: "upcoming", // upcoming, active, completed
    totalVotes: 0,
    createdAt: new Date("2024-01-01"),
  },
];

export const mockVotes = [
  // Votes will be stored here when cast
  // Structure: { id, voterId, candidateId, electionId, timestamp }
];

// Helper functions for mock database operations
export const findUserByEmail = (email) => {
  return mockUsers.find((user) => user.email === email);
};

export const findUserById = (id) => {
  return mockUsers.find((user) => user.id === id);
};

export const addUser = (userData) => {
  const newUser = {
    id: mockUsers.length + 1,
    ...userData,
    createdAt: new Date(),
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = (id, updates) => {
  const userIndex = mockUsers.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  }
  return null;
};

export const deleteUser = (id) => {
  const userIndex = mockUsers.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    return mockUsers.splice(userIndex, 1)[0];
  }
  return null;
};

export const addCandidate = (candidateData) => {
  const newCandidate = {
    id: mockCandidates.length + 1,
    ...candidateData,
    votes: 0,
    createdAt: new Date(),
  };
  mockCandidates.push(newCandidate);
  return newCandidate;
};

export const updateCandidate = (id, updates) => {
  const candidateIndex = mockCandidates.findIndex(
    (candidate) => candidate.id === id
  );
  if (candidateIndex !== -1) {
    mockCandidates[candidateIndex] = {
      ...mockCandidates[candidateIndex],
      ...updates,
    };
    return mockCandidates[candidateIndex];
  }
  return null;
};

export const deleteCandidate = (id) => {
  const candidateIndex = mockCandidates.findIndex(
    (candidate) => candidate.id === id
  );
  if (candidateIndex !== -1) {
    return mockCandidates.splice(candidateIndex, 1)[0];
  }
  return null;
};

export const castVote = (voterId, candidateId, electionId) => {
  // Check if user already voted
  const existingVote = mockVotes.find(
    (vote) => vote.voterId === voterId && vote.electionId === electionId
  );
  if (existingVote) {
    return { error: "User has already voted in this election" };
  }

  // Add vote
  const newVote = {
    id: mockVotes.length + 1,
    voterId,
    candidateId,
    electionId,
    timestamp: new Date(),
  };
  mockVotes.push(newVote);

  // Update candidate vote count
  const candidate = mockCandidates.find((c) => c.id === candidateId);
  if (candidate) {
    candidate.votes += 1;
  }

  // Mark user as voted
  const user = findUserById(voterId);
  if (user) {
    user.hasVoted = true;
  }

  // Update election total votes
  const election = mockElections.find((e) => e.id === electionId);
  if (election) {
    election.totalVotes += 1;
  }

  return { success: true, vote: newVote };
};

export const getElectionResults = (electionId) => {
  const election = mockElections.find((e) => e.id === electionId);
  if (!election) return null;

  const candidates = mockCandidates.map((candidate) => ({
    ...candidate,
    percentage:
      election.totalVotes > 0
        ? ((candidate.votes / election.totalVotes) * 100).toFixed(1)
        : 0,
  }));

  return {
    election,
    candidates: candidates.sort((a, b) => b.votes - a.votes),
    totalVotes: election.totalVotes,
  };
};
