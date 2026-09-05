import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
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
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
    },
    durationMinutes: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes must be at most 1000 characters"],
    },
  },
  { timestamps: true }
);

studySessionSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: String(this._id),
    user: String(this.user),
    subject: this.subject && this.subject._id ? (this.subject.toSafeObject ? this.subject.toSafeObject() : this.subject) : String(this.subject),
    task: this.task ? (this.task._id ? (this.task.toSafeObject ? this.task.toSafeObject() : this.task) : String(this.task)) : null,
    date: this.date,
    startTime: this.startTime,
    endTime: this.endTime,
    durationMinutes: this.durationMinutes,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

studySessionSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const StudySession = mongoose.model("StudySession", studySessionSchema);

export default StudySession;
