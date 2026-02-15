const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Socket event handlers
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Join admin room for admin-specific updates
  socket.on("joinAdmin", () => {
    socket.join("admin");
    console.log("👨‍💼 Admin joined:", socket.id);
  });

  // Receive real-time event from Next.js
  socket.on("voteUpdate", (data) => {
    console.log("🗳️ Vote update received:", data);
    io.emit("voteUpdate", data); // Broadcast to all connected clients
  });

  socket.on("allVoters", (data) => {
    console.log("🗳️ All voters received:", data);
    io.emit("allVoters", data); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// HTTP endpoint for Next.js to trigger socket events
app.post("/voteUpdate", (req, res) => {
  const data = req.body;
  console.log("📡 Vote update via HTTP:", data);
  io.emit("voteUpdate", data); // Emit update to all connected clients
  res.json({ status: "ok", message: "Vote update broadcasted" });
});

app.post("/allVoters", (req, res) => {
  const data = req.body;
  console.log("📡 All voters via HTTP:", data);
  io.emit("allVoters", data); // Emit update to all connected clients
  res.json({ status: "ok", message: "All voters broadcasted" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Socket.io server is running" });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🔥 Socket.io server running on port ${PORT}`);
});
