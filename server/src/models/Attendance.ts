import { model, Schema, Types, type HydratedDocument } from "mongoose";

export type AttendanceStatus = "Present" | "Absent" | "Leave";

export type AttendanceDocument = HydratedDocument<{
  employee: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}>;

const attendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = model("Attendance", attendanceSchema);
