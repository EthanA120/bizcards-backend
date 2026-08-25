import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import config from "config";

dotenv.config();

// Define the MongoDB connection URI, prioritizing the environment variable over the local configuration
const LOCAL_URI = config.get("mongodb.url");
const mongodbURL = process.env.MONGODB_URI || LOCAL_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURL);
    
    // Determine if the connection is to a cloud database or a local database
    const isCloud = mongodbURL.includes("+srv");
    const connectionType = isCloud ? chalk.magenta("Atlas Cloud") : "Local Database";
    
    console.log(chalk.green('MongoDB connected successfully to:'), connectionType);
  } catch (error) {
    console.error(chalk.red("Error connecting to MongoDB:"), error.message);
    process.exit(1);
  }
};

export default connectDB;