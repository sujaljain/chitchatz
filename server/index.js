/*
myapp/
│── server.js         # Entry point
│── config/
│   └── db.js        # Database connection
│── models/
│   └── User.js      # Model (Database Schema)
│── controllers/
│   └── AuthController.js  # Controller (Business Logic)
│── routes/
│   └── AuthRoutes.js # Routes (API Endpoints)
│── views/           # Views (If using templating engine)
│── middleware/      # Custom middleware (auth, logging)
└── .env            # Environment variables
 
*/


import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactRoutes.js"
import setupSocket from './socket.js';
import messagesRoutes from "./routes/MessagesRoutes.js"
import channelRoutes from "./routes/ChannelRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
)

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL)
    .then(() => console.log('Database Connecion is Successful!'))
    .catch((err) => console.log(err.message));