import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();
  const server = createServer(app);

  server.listen(env.PORT, () => {
    console.log(`StaffFlow API listening on http://localhost:${env.PORT}.`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received. Closing StaffFlow API…`);
    server.close(() => {
      void disconnectDatabase().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error: unknown) => {
  console.error("StaffFlow API failed to start:", error);
  process.exit(1);
});
