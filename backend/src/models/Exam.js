import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    examDate: {
      type: Date,
      required: [true, "Exam date is required"],
    },
    examType: {
      type: String,
      enum: ["Internal", "Mid", "Semester", "Practical", "Viva", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed"],
      default: "Upcoming",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description must be at most 1000 characters"],
    },
  },
  { timestamps: true }
);

examSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: String(this._id),
    user: String(this.user),
    subject: this.subject && this.subject._id ? (this.subject.toSafeObject ? this.subject.toSafeObject() : this.subject) : String(this.subject),
    title: this.title,
    examDate: this.examDate,
    examType: this.examType,
    status: this.status,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

examSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
