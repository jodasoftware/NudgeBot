// src/scheduler.ts
import { Queue } from "bull";
import axios from "axios";
import taskQueue from "./redisClient";

interface Reminder {
  userId: string;
  reminderId: string;
  title: string;
  body: string;
  date: Date;
}

export const scheduleTask = async (reminder: Reminder) => {
  const now = new Date();
  const delay = reminder.date.getTime() - now.getTime();

  await taskQueue.add(
    {
      title: reminder.title,
      body: reminder.body,
      userId: reminder.userId,
    },
    { delay }
  );
};

export const cancelTasks = async (reminderIds: string[]) => {
  for (const reminderId of reminderIds) {
    await taskQueue.removeJobs(reminderId);
  }
};

taskQueue.process(async (job) => {
  console.log(`Now sending reminder:`, job.data);
  try {
    const response = await axios.post(
      "http://api.moneymemo.app/notifications/send",
      job.data
    );
    console.log(`HTTP request succeeded:`, response.status);
  } catch (error) {
    console.error(`HTTP request to failed:`, error);
  }

  // Optionally remove the task from Redis once executed
  await job.remove();
});
