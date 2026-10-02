import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/food");
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB connection failed:", error);
  }
};

export default connectDB;



