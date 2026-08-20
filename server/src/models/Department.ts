import { model, Schema, type HydratedDocument } from "mongoose";

export type DepartmentDocument = HydratedDocument<{
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}>;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true },
);

departmentSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export const Department = model("Department", departmentSchema);
