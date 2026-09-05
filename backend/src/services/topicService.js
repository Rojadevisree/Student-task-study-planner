import Topic from "../models/Topic.js";
import Subject from "../models/Subject.js";
import { AppError } from "../utils/AppError.js";

async function verifySubjectOwnership(userId, subjectId) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });
  if (!subject) {
    throw new AppError("Subject not found or does not belong to you", 404);
  }
}

export async function createTopic(userId, payload) {
  await verifySubjectOwnership(userId, payload.subject);

  const topic = await Topic.create({
    user: userId,
    subject: payload.subject,
    name: payload.name,
    status: payload.status,
    priority: payload.priority,
    description: payload.description,
  });

  await topic.populate("subject");
  return topic.toSafeObject();
}

export async function getTopics(userId) {
  const topics = await Topic.find({ user: userId })
    .populate("subject")
    .sort({ createdAt: -1 });
  return topics.map((t) => t.toSafeObject());
}

export async function getTopic(userId, topicId) {
  const topic = await Topic.findOne({ _id: topicId, user: userId }).populate("subject");
  if (!topic) {
    throw new AppError("Topic not found", 404);
  }
  return topic.toSafeObject();
}

export async function updateTopic(userId, topicId, payload) {
  const topic = await Topic.findOne({ _id: topicId, user: userId });
  if (!topic) {
    throw new AppError("Topic not found", 404);
  }

  if (payload.subject && String(payload.subject) !== String(topic.subject)) {
    await verifySubjectOwnership(userId, payload.subject);
    topic.subject = payload.subject;
  }

  if (payload.name !== undefined) topic.name = payload.name;
  if (payload.status !== undefined) topic.status = payload.status;
  if (payload.priority !== undefined) topic.priority = payload.priority;
  if (payload.description !== undefined) topic.description = payload.description;

  await topic.save();
  await topic.populate("subject");
  return topic.toSafeObject();
}

export async function deleteTopic(userId, topicId) {
  const topic = await Topic.findOneAndDelete({ _id: topicId, user: userId });
  if (!topic) {
    throw new AppError("Topic not found", 404);
  }
  return true;
}
