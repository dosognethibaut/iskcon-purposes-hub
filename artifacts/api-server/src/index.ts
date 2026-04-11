import app from "./app";
import { logger } from "./lib/logger";
import { seedPurposes } from "./utils/seed";

const rawPort = process.env["PORT"];
if (rawPort) {
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  app.listen(port, async (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
    await seedPurposes();
  });
} else {
  logger.info("PORT not set; exporting app for serverless runtime");
}

export default app;
