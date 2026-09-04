import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pomodoroSettingsSchema = new mongoose.Schema(
  {
    workMinutes: { type: Number, default: 25, min: 1, max: 120 },
    shortBreakMinutes: { type: Number, default: 5, min: 1, max: 60 },
    longBreakMinutes: { type: Number, default: 15, min: 1, max: 60 },
    sessionsUntilLongBreak: { type: Number, default: 4, min: 1, max: 12 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be at most 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    timezone: {
      type: String,
      trim: true,
      default: "UTC",
    },
    pomodoroSettings: {
      type: pomodoroSettingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    timezone: this.timezone,
    pomodoroSettings: this.pomodoroSettings,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
