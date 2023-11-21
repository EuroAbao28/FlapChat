const express = require("express");
const color = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/message", require("./routes/messageRoute"));
app.use("/api/chatRoom", require("./routes/chatRoomRoutes"));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
  console.log("user id  :", socket.id);

  socket.on("joinRoom", (data) => {
    socket.join(data);
    console.log("Room:", data);
  });

  socket.on("sendMessage", (data) => {
    console.log(
      `Message from ${data.sender} to ${data.receiver}: ${data.text}. Room ${data.room}`
    );
    socket.to(data.room).emit("receiveMessage", data);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server started on Port ${process.env.PORT}`.yellow.underline)
);
