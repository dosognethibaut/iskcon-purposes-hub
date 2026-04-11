import app from "./app";

const rawPort = process.env["PORT"];
if (rawPort) {
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  app.listen(port, async (err) => {
    if (err) {
      console.error("Error listening on port", err);
      process.exit(1);
    }

    console.info("Server listening", { port });
    const { seedPurposes } = await import("./utils/seed");
    await seedPurposes();
  });
} else {
  console.info("PORT not set; exporting app for serverless runtime");
}

export default app;
