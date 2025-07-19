require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require("./socketServer");
const { ExpressPeerServer } = require("peer");
const path = require("path");

const app = express();
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: ["https://sociosphere-ten.vercel.app", "http://localhost:3000", "https://69f218f0-915f-473f-9072-57a577b86780-00-1sjx3pcr451nc.pike.replit.dev"],
    credentials: true,
  })
);
app.use(cookieParser());

// Socket
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["https://sociosphere-ten.vercel.app", "http://localhost:3000", "https://69f218f0-915f-473f-9072-57a577b86780-00-1sjx3pcr451nc.pike.replit.dev"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  SocketServer(socket);
});

// Create peer server
ExpressPeerServer(http, { path: "/" });

// Routes
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/commentRouter"));
app.use("/api", require("./routes/notifyRouter"));
app.use("/api", require("./routes/messageRouter"));

const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 4000;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
