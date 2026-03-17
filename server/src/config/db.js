import mongoose from "mongoose";
import "dotenv/config"

const PORT = process.env.PORT || 5000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas connected.");
    }
    catch (err) {
        console.error(err.message);
    }
};

export { connect }