const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

const {
  startStreamProcessor
} = require("./services/streamProcessor.service");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Start the RxJS telemetry listener
    startStreamProcessor();

    app.listen(PORT, () => {
      console.log(`NexusFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
