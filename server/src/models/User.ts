import { model, Schema, type HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<{
  name: string;
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}>;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export const User = model("User", userSchema);
