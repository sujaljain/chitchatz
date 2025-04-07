import mongoose from "mongoose";
import { genSalt, hash } from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre("save", async function (next) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();     //  Use next() in middleware functions when you need to pass control to the next function in the request-response cycle.
                // DO NOT use next() inside route handlers if you're already sending a response (res.send(), res.json()).
});

const User = mongoose.model("Users", userSchema);

export default User;
