import Subject from "../models/Subject.js";
import Task from "../models/Task.js";
import Exam from "../models/Exam.js";
import Topic from "../models/Topic.js";
import StudySession from "../models/StudySession.js";

export async function getDashboardData(userId) {
  const [
    totalSubjects,
    pendingTasksCount,
    completedTasksCount,
    upcomingExamsCount,
    studySessions,
    topics,
    tasks,
    exams,
  ] = await Promise.all([
    Subject.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: { $ne: "Completed" } }),
    Task.countDocuments({ user: userId, status: "Completed" }),
    Exam.countDocuments({ user: userId, status: { $ne: "Completed" } }),
    StudySession.find({ user: userId }),
    Topic.find({ user: userId }).populate("subject"),
    Task.find({ user: userId, status: { $ne: "Completed" } }).sort({ dueDate: 1 }).limit(5).populate("subject"),
    Exam.find({ user: userId, status: { $ne: "Completed" } }).sort({ examDate: 1 }).limit(5).populate("subject"),
  ]);

  const totalStudyTime = studySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.status === "Completed").length;

  const subjectProgress = {};
  topics.forEach(t => {
    const subName = t.subject?.name || "Unknown";
    if (!subjectProgress[subName]) {
      subjectProgress[subName] = { total: 0, completed: 0 };
    }
    subjectProgress[subName].total += 1;
    if (t.status === "Completed") subjectProgress[subName].completed += 1;
  });

  const formattedSubjectProgress = Object.keys(subjectProgress).map(key => ({
    subjectName: key,
    total: subjectProgress[key].total,
    completed: subjectProgress[key].completed,
    percentage: Math.round((subjectProgress[key].completed / subjectProgress[key].total) * 100) || 0
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const studyTimeToday = studySessions
    .filter(s => new Date(s.startTime) >= today)
    .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  return {
    summary: {
      totalSubjects,
      pendingTasks: pendingTasksCount,
      completedTasks: completedTasksCount,
      upcomingExams: upcomingExamsCount,
      totalStudyTime,
      totalTopics,
      completedTopics,
    },
    upcomingTasks: tasks.map(t => t.toSafeObject()),
    upcomingExams: exams.map(e => e.toSafeObject()),
    subjectProgress: formattedSubjectProgress,
    studyActivity: {
      totalStudyTime,
      studyTimeToday,
      totalSessions: studySessions.length,
    }
  };
}

export async function getAnalyticsData(userId) {
  const [
    tasks,
    studySessions,
    topics,
    exams,
  ] = await Promise.all([
    Task.find({ user: userId }),
    StudySession.find({ user: userId }),
    Topic.find({ user: userId }).populate("subject"),
    Exam.find({ user: userId }),
  ]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = tasks.filter(t => t.status !== "Completed" && new Date(t.dueDate) >= new Date()).length;
  const overdueTasks = tasks.filter(t => t.status !== "Completed" && new Date(t.dueDate) < new Date()).length;
  const taskCompletionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalStudyTime = studySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalSessions = studySessions.length;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0,0,0,0);

  const thisWeekSessions = studySessions.filter(s => new Date(s.startTime) >= weekStart);
  const studyTimeThisWeek = thisWeekSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  const subjectStats = {};
  topics.forEach(t => {
    const sid = t.subject?._id ? String(t.subject._id) : String(t.subject);
    const sname = t.subject?.name || "Unknown";
    if (!subjectStats[sid]) subjectStats[sid] = { name: sname, totalTopics: 0, completedTopics: 0, tasks: 0, completedTasks: 0, studyTime: 0 };
    subjectStats[sid].totalTopics += 1;
    if (t.status === "Completed") subjectStats[sid].completedTopics += 1;
  });

  tasks.forEach(t => {
    const sid = String(t.subject);
    if (subjectStats[sid]) {
      subjectStats[sid].tasks += 1;
      if (t.status === "Completed") subjectStats[sid].completedTasks += 1;
    }
  });

  studySessions.forEach(s => {
    const sid = String(s.subject);
    if (subjectStats[sid]) {
      subjectStats[sid].studyTime += (s.durationMinutes || 0);
    }
  });

  const formattedSubjectStats = Object.values(subjectStats).map(s => ({
    ...s,
    topicPercentage: s.totalTopics === 0 ? 0 : Math.round((s.completedTopics / s.totalTopics) * 100),
    taskPercentage: s.tasks === 0 ? 0 : Math.round((s.completedTasks / s.tasks) * 100),
  }));

  const upcomingExams = exams.filter(e => e.status !== "Completed").length;
  const completedExams = exams.filter(e => e.status === "Completed").length;

  return {
    taskAnalytics: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage: taskCompletionPercentage,
    },
    studyAnalytics: {
      totalStudyTime,
      totalSessions,
      studyTimeThisWeek,
    },
    subjectPerformance: formattedSubjectStats,
    examOverview: {
      upcomingExams,
      completedExams,
    },
    overallProgress: taskCompletionPercentage
  };
}
