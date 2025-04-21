import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;

        if (!searchTerm || typeof searchTerm !== "string") {
            return response.status(400).send("searchTerm is required & must be a valid string!");
        }

        const regex = new RegExp(searchTerm.trim(), "i"); // This "i" makes it case-insensitive
        // ✅ Regular Expressions (RegEx) are patterns used to match text. They help search for words inside a string. MongoDB supports regex for searching in the database.


        const contacts = await User.find({
            $and: [ // ✅ Both conditions must be true
                // Condition 1
                { _id: { $ne: request.userId } }, // ✅ $ne --> (Not Equals To), therefore exclude the logged-in user

                // Condition 2
                {
                    $or: [ // ✅ At least one condition must be true 
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                }
            ]
        });

        if (!contacts.length) {
            return response.status(404).json({ message: "No contacts found!" });
        }
        return response.status(200).json({ contacts });

    } catch (error) {
        console.log("❌ Error in searchContacts:", error);
        return response.status(500).send("Internal Server Error");
    }
};


export const getContactsForDMList = async (request, response, next) => {
    try {
        let { userId } = request; // ✅ Extract userId from request body
        if (!userId) {
            return response.status(400).send("User ID is required");
        }

        userId = new mongoose.Types.ObjectId(userId); // ✅ Convert to ObjectId

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] }, // ✅ Fixed `$eq`
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            { $unwind: "$contactInfo" },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            { $sort: { lastMessageTime: -1 } },
        ]);

        return response.status(200).json({ contacts });

    } catch (error) {
        console.log("❌ Error in getContactsForDMList:", error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getAllContacts = async (request, response, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: request.userId } },
            "firstName lastName _id"
        );

        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }));

        return response.status(200).json({ contacts });

    } catch (error) {
        console.log("❌ Error in searchContacts:", error);
        return response.status(500).send("Internal Server Error");
    }
};
