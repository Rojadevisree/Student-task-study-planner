import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["TASK_UPCOMING", "TASK_DUE_SOON", "TASK_OVERDUE", "EXAM_UPCOMING", "EXAM_TODAY", "GENERAL"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntityType: {
      type: String,
      enum: ["Task", "Exam", "None"],
      default: "None",
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    targetDate: {
      type: Date,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for quick lookups on specific generated notifications to prevent duplicates
notificationSchema.index({ user: 1, type: 1, relatedEntityId: 1 }, { unique: true, partialFilterExpression: { relatedEntityId: { $exists: true } } });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

notificationSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: String(this._id),
    type: this.type,
    title: this.title,
    message: this.message,
    relatedEntityType: this.relatedEntityType,
    relatedEntityId: this.relatedEntityId ? String(this.relatedEntityId) : null,
    targetDate: this.targetDate || this.createdAt,
    isRead: this.isRead,
    createdAt: this.createdAt,
  };
};

notificationSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
