import mongoose from "mongoose";

let isConnected = false;
mongoose.set("strictQuery", true);

export const dbConnect = async () => {
  if (isConnected) {
    console.log("Database already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    isConnected = true;
    console.log("Database connected!");
  } catch (err) {
    console.error("Database connection failed!", err);
  }
};
