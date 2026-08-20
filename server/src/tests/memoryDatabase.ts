import { MongoMemoryServer } from "mongodb-memory-server";

const port = Number(process.env.MEMORY_MONGODB_PORT ?? 27017);
const mongoServer = await MongoMemoryServer.create({
  instance: { port, dbName: "staffflow" },
});

console.log(`Temporary MongoDB ready at ${mongoServer.getUri("staffflow")}`);

async function shutdown() {
  await mongoServer.stop();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

await new Promise(() => undefined);
