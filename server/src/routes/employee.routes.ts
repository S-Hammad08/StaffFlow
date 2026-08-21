import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from "../controllers/employee.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireWriteAccess } from "../middleware/requireWriteAccess.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { employeeBodySchema, employeeQuerySchema } from "../validators/employee.validator.js";

export const employeeRouter = Router();

employeeRouter.use(authenticate);
employeeRouter.get("/", validate({ query: employeeQuerySchema }), listEmployees);
employeeRouter.get("/:id", validate({ params: idParamsSchema }), getEmployee);
employeeRouter.post(
  "/",
  requireWriteAccess,
  validate({ body: employeeBodySchema }),
  createEmployee,
);
employeeRouter.put(
  "/:id",
  requireWriteAccess,
  validate({ params: idParamsSchema, body: employeeBodySchema }),
  updateEmployee,
);
employeeRouter.delete(
  "/:id",
  requireWriteAccess,
  validate({ params: idParamsSchema }),
  deleteEmployee,
);
