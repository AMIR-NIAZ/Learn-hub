import mongoose from "mongoose";
import dotenv from "dotenv";
import { App } from "./app";

dotenv.config();

class Database {
  static async connect() {
    try {
      await mongoose.connect(process.env.DB_URL!);
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ DB connection error:", err);
      process.exit(1);
    }
  }
}

class Server {
  private appInstance = new App();

  start() {
    this.appInstance.app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  }
}

(async () => {
  await Database.connect();
  new Server().start();
})();
