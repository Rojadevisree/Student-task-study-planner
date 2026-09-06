import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      maxlength: [100, "Subject name must be at most 100 characters"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: [30, "Color must be at most 30 characters"],
    },
  },
  { timestamps: true }
);

subjectSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: String(this._id),
    user: String(this.user),
    name: this.name,
    difficulty: this.difficulty,
    color: this.color,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

subjectSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
