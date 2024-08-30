import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
const connect = async () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log("MongoDB is already connected");
        return;
    }
    if (connectionState === 2) {
        console.log("MongoDB is connecting");
        return;
    }
    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: "mongodb",
            bufferCommands: true
        });
        console.log("MongoDB connected successfully");
    }
    catch (error: any) {
        console.error("Failed to connect to MongoDB", error);
        throw new Error("Error: ", error);
    }
};

export default connect;