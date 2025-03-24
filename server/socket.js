import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    // ✅ Handles sending messages
    const sendMessage = async (message) => {
        try {
            if (!message.sender || !message.recipient || (!message.content && !message.fileUrl)) {
                console.error("⚠️ Invalid message data:", message);
                return;
            }

            console.log("📩 Message received on server:", message);

            // ✅ Get sender & recipient socket IDs from the map
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);

            // ✅ Save the message in the database
            const createdMessage = await Message.create(message);

            // ✅ Fetch the message again & populate sender and recipient details
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color");

            console.log("✅ Message saved & populated:", messageData);

            // ✅ Send message to the recipient (if online & for UI update)
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData);
                console.log("📩 Sent message to recipient:", recipientSocketId);
            } else {
                console.log("⚠️ Recipient is offline. Message stored in DB.");
            }

            // ✅ Send message back to the sender (for UI update)
            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
                console.log("📩 Sent message back to sender:", senderSocketId);
            }
        } catch (error) {
            console.error("❌ Error in sendMessage:", error);
        }
    };


    // ✅ Handles user disconnection properly
    const handleDisconnect = (socket) => {
        console.log(`❌ Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`🗑️ Removed user: ${userId} from active users`);
                break;
            }
        }
    };

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content, messageType, timeStamp: new Date(),
            fileUrl,
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        const channel = await Channel.findById(channelId).populate("members");

        const finalData = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((member) => {

                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finalData);
                }

                const adminSocketId = userSocketMap.get(channel.admin._id.toString());
                if (adminSocketId) {
                    io.to(adminSocketId).emit("recieve-channel-message", finalData);
                }
            })
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`✅ User ${userId} connected with Socket ID: ${socket.id}`);
        } else {
            console.log("⚠️ User ID not provided during connection");
        }

        // ✅ Listen for messages
        socket.on("sendMessage", sendMessage);

        socket.on("send-channel-message", sendChannelMessage);

        // ✅ Handle disconnection correctly
        socket.on("disconnect", () => handleDisconnect(socket));
    });
};

export default setupSocket;