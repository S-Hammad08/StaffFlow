import { model, Schema, Types, type HydratedDocument } from "mongoose";

export type EmployeeStatus = "Active" | "Inactive";

export type EmployeeDocument = HydratedDocument<{
  name: string;
  email: string;
  department: Types.ObjectId;
  status: EmployeeStatus;
  createdAt: Date;
  updatedAt: Date;
}>;

const employeeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
  },
  { timestamps: true },
);

employeeSchema.index({ name: 1 });
employeeSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export const Employee = model("Employee", employeeSchema);
