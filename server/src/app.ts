import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { AppError } from "./errors/AppError.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { departmentRouter } from "./routes/department.routes.js";
import { employeeRouter } from "./routes/employee.routes.js";
import { reportRouter } from "./routes/report.routes.js";

const helmetMiddleware =
  helmet as unknown as () => express.RequestHandler;

export const app = express();

app.disable("x-powered-by");

app.use(helmetMiddleware());

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || origin === env.CLIENT_URL) {
        callback(null, true);
        return;
      }

      callback(
        new AppError(
          403,
          "This origin is not allowed to access StaffFlow."
        )
      );
    },
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    data: { status: "ok" },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/reports", reportRouter);

app.use(notFoundHandler);
app.use(errorHandler);