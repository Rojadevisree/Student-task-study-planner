import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must be at most 100 characters"],
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description must be at most 1000 characters"],
    },
  },
  { timestamps: true }
);

topicSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: String(this._id),
    user: String(this.user),
    subject: this.subject && this.subject._id ? (this.subject.toSafeObject ? this.subject.toSafeObject() : this.subject) : String(this.subject),
    name: this.name,
    status: this.status,
    priority: this.priority,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

topicSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
