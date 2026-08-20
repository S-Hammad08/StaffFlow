import { Router } from "express";
import { getSummary } from "../controllers/report.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const reportRouter = Router();

reportRouter.use(authenticate);
reportRouter.get("/summary", getSummary);
