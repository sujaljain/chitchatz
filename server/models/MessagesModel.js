import mongoose from 'mongoose';

const messsageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false, // Some messages don’t have a single recipient (e.g., system messages, group chats).
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        },
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        },
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    }
});

const Message = mongoose.model("Messages", messsageSchema);

export default Message;