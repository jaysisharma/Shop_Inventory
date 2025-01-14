import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://jaisysharma9817:cwGTQ8YB7AYQ7zI7@cluster0.xzq90.mongodb.net/?retryWrites=true&w=majority&tls=true&appName=Cluster0",{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

export default connectDB;
