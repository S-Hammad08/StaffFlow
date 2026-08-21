import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  listDepartments,
  updateDepartment,
} from "../controllers/department.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireWriteAccess } from "../middleware/requireWriteAccess.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { departmentBodySchema } from "../validators/department.validator.js";

export const departmentRouter = Router();

departmentRouter.use(authenticate);
departmentRouter.get("/", listDepartments);
departmentRouter.post(
  "/",
  requireWriteAccess,
  validate({ body: departmentBodySchema }),
  createDepartment,
);
departmentRouter.put(
  "/:id",
  requireWriteAccess,
  validate({ params: idParamsSchema, body: departmentBodySchema }),
  updateDepartment,
);
departmentRouter.delete(
  "/:id",
  requireWriteAccess,
  validate({ params: idParamsSchema }),
  deleteDepartment,
);
