# 🗳️ Real-time Voting System

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Both Servers
```bash
# Start both Next.js and Socket.io servers
npm run dev:all

# Or start them separately:
# Terminal 1: Next.js
npm run dev

# Terminal 2: Socket.io server
npm run dev:socket
```

### 3. Access the Application
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Voting Interface**: http://localhost:3000/vote
- **Socket.io Server**: http://localhost:4000

## 🏗️ Architecture

### Workflow
1. **User votes** → Next.js API `/api/vote`
2. **Next.js processes** → Stores vote in database
3. **Next.js notifies** → Socket.io server via HTTP
4. **Socket.io broadcasts** → Live updates to all clients
5. **Admin dashboard** → Updates instantly

### Components

#### Backend
- **Express + Socket.io Server** (`express-server.js`) - Port 4000
- **Next.js API Routes** (`/api/vote`, `/api/elections/[id]/results`)
- **Database Integration** (Prisma + MongoDB)

#### Frontend
- **Real-time Hook** (`hooks/useSocket.js`)
- **Live Vote Count** (`components/admin/live-vote-count.jsx`)
- **Election Results** (`components/admin/election-results-view.jsx`)

## 🔧 Configuration

### Environment Variables
```env
# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
SOCKET_SERVER_URL="http://localhost:4000"
SOCKET_PORT=4000
```

### Socket.io Events
- **`voteUpdate`** - Broadcasted when a vote is cast
- **`joinAdmin`** - Admin clients join admin room

## 📊 Data Structure

### Vote Update Event
```json
{
  "type": "VOTE_CAST",
  "electionId": "election_id",
  "categoryId": "category_id", 
  "candidateId": "candidate_id",
  "voterId": "voter_id",
  "timestamp": "2025-10-11T14:30:00.000Z",
  "results": {
    "election": {
      "id": "election_id",
      "title": "Election Title",
      "totalVotes": 150
    },
    "results": [
      {
        "category": {
          "id": "category_id",
          "name": "president",
          "displayName": "President"
        },
        "candidates": [
          {
            "id": "candidate_id",
            "name": "Candidate Name",
            "votes": 75,
            "percentage": "50.00"
          }
        ],
        "totalVotes": 150,
        "winner": {
          "id": "candidate_id",
          "name": "Candidate Name",
          "votes": 75,
          "percentage": "50.00"
        }
      }
    ]
  }
}
```

## 🧪 Testing

### 1. Cast a Test Vote
Visit `/vote` and use these sample IDs from your database:
- Get voter, candidate, election, and category IDs from your admin panel
- Fill the form and submit

### 2. Watch Live Updates
- Open admin dashboard in multiple tabs
- Cast votes and see real-time updates
- Check connection status (Live/Offline badge)

### 3. API Testing
```bash
# Test vote casting
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "voterId": "your_voter_id",
    "candidateId": "your_candidate_id", 
    "electionId": "your_election_id",
    "categoryId": "your_category_id"
  }'

# Test results fetching
curl http://localhost:3000/api/elections/your_election_id/results
```

## 🔍 Monitoring

### Socket.io Server Logs
```bash
✅ Client connected: socket_id
👨‍💼 Admin joined: socket_id
🗳️ Vote update received: {...}
📡 Vote update via HTTP: {...}
❌ Client disconnected: socket_id
```

### Browser Console
```javascript
// Check socket connection
console.log("Socket connected:", socket.connected);

// Listen for vote updates
socket.on("voteUpdate", (data) => {
  console.log("Vote update received:", data);
});
```

## 🚨 Troubleshooting

### Socket Connection Issues
1. Ensure Socket.io server is running on port 4000
2. Check CORS settings in `express-server.js`
3. Verify `NEXT_PUBLIC_SOCKET_URL` environment variable

### Vote Not Updating
1. Check database connection
2. Verify election is active and within time range
3. Ensure voter hasn't already voted in the category
4. Check Socket.io server logs for HTTP notifications

### Real-time Updates Not Working
1. Refresh the admin dashboard
2. Check browser console for socket errors
3. Verify Socket.io server is receiving HTTP notifications
4. Check network tab for failed requests

## 🔒 Security Notes

- Socket.io server accepts connections from any origin (development only)
- Vote validation is handled by Next.js API routes
- Database operations are secured through Prisma
- Consider implementing authentication for Socket.io in production

## 🚀 Production Deployment

1. **Environment Variables**: Update URLs for production
2. **CORS**: Restrict Socket.io CORS to your domain
3. **Authentication**: Add Socket.io authentication
4. **Scaling**: Consider Redis adapter for multiple Socket.io instances
5. **SSL**: Use HTTPS/WSS for secure connections