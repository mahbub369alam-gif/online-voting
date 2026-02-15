const SOCKET_SERVER_URL =
  process.env.SOCKET_SERVER_URL || "http://localhost:4000";

export async function notifyVoteUpdate(voteData) {
  try {
    const response = await fetch(`${SOCKET_SERVER_URL}/voteUpdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteData),
    });

    if (!response.ok) {
      throw new Error(`Socket notification failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("📡 Socket notification sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to notify socket server:", error);
    // Don't throw error to prevent vote failure if socket server is down
    return null;
  }
}

export async function notifyAllVoters(voteData) {
  try {
    const response = await fetch(`${SOCKET_SERVER_URL}/allVoters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteData),
    });

    if (!response.ok) {
      throw new Error(`Socket notification failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("📡 Socket notification sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to notify socket server:", error);
    // Don't throw error to prevent vote failure if socket server is down
    return null;
  }
}
