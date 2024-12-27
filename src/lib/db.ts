import { DB_NAME } from "@/constants";
import { MONGODB_MAX_RETRIES, MONGODB_RETRY_INTERVAL } from "./constants";
import mongoose from "mongoose";

class DatabaseConnection {
  private retryCount: number;
  private isConnected: boolean;
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // config mongoose settings
    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => {
      console.log(`mongodb connected successfully`);
      this.isConnected = true;
    });

    mongoose.connection.on("error", () => {
      console.log(`connection error`);
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", async () => {
      console.log(`mongodb disconnected`);
      await this.handleDisconnection();
    });
    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }
  // methods

  async connectToDB() {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO DB URI is not present in uri");
    }

    const connectionOption = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 8,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // use ipv4
    };

    if (process.env.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }
    try {
      if (this.isConnected) {
        console.log("Already Connected to MongoDB");
        return;
      }
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGO_URI}/${DB_NAME}`,
        connectionOption
      );

      this.isConnected = connectionInstance.connections[0].readyState === 1;
      this.retryCount = 0;

      console.log("DB connected");
    } catch (error) {
      console.log("ERR: error while connecting", error);
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MONGODB_MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `retry count ${this.retryCount} out of ${MONGODB_MAX_RETRIES}`
      );
      setTimeout(() => {
        this.connectToDB();
      }, MONGODB_RETRY_INTERVAL);
    } else {
      console.log(
        `Failed to connect to MONGODB after ${MONGODB_MAX_RETRIES} attempts`
      );

      process.exit(1);
    }
  }
  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attempting to reconnected");
      this.connectToDB();
    }
  }
  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (error) {
      console.log("Error during datase disconnection", error);
      process.exit(1);
    }
  }
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

export const dbConnectionInstance = new DatabaseConnection();
