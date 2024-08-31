import express from "express";
import bodyParser from "body-parser";
import { scheduleTask, cancelTasks } from "./scheduler";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to schedule a task
app.post("/schedule", async (req, res) => {
  console.log("req.body", req.body);

  const { notifications, userId } = req.body;
  if (!notifications) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // For each notification, schedule a task
  try {
    for (const { id, title, body, invokeDate } of notifications) {
      const taskDate = new Date(invokeDate);
      if (isNaN(taskDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      await scheduleTask({
        userId,
        reminderId: id,
        title,
        body,
        date: taskDate,
      });
      console.log(`Task scheduled for ${taskDate}`);
    }

    res.status(200).json({ message: "Tasks scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling tasks:", error);
    res.status(500).json({ error: "Failed to schedule tasks" });
  }
});

// Route to cancel multiple tasks
app.post("/cancel", async (req, res) => {
  console.log("req.body", req.body);

  const { reminderIds } = req.body;
  if (!reminderIds) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // For each reminder ID, cancel the task
  cancelTasks(reminderIds);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
