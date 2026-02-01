import { env } from "./common/utils/envConfig.js";
import { logger } from "./common/utils/logger.js";
import { connectMongoDB } from "./config/mongodb.js";
import app from "./server.js";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Start Express server
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: ${env.HOST}:${env.PORT}/health`);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
};

startServer();
