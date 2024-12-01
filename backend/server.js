const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,
{
    cors: 
    {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Storing the current data
let notes = [];
let drawing = null;

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Sending current state to the new user
    socket.emit("notes-updated", notes);
    socket.emit("drawing-updated", drawing);

    // Handling the notes update
    socket.on("update-notes", (updatedNotes) => 
    {
        console.log("User updated notes", updatedNotes);
        notes = updatedNotes;
        socket.broadcast.emit("notes-updated", notes);
    });

    // Handling the drawing actions in real-time
    socket.on("drawing-data", (data) =>
    {
        console.log("Real-time drawing data received:", data);
        socket.broadcast.emit("drawing-data", data);
    });

    socket.on("disconnect", () => 
    {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
