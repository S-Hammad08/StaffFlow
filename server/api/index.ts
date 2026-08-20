import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

let isConnected = false;

async function ensureDatabaseConnection() {
  if (!isConnected) {
    await connectDatabase();
    isConnected = true;
  }
}

export default async function handler(req: any, res: any) {
  await ensureDatabaseConnection();
  return app(req, res);
}