"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const scheduler_1 = require("./scheduler");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Route to schedule a task
app.post("/schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, scheduler_1.scheduleTask)({
                userId,
                reminderId: id,
                title,
                body,
                date: taskDate,
            });
            console.log(`Task scheduled for ${taskDate}`);
        }
        res.status(200).json({ message: "Tasks scheduled successfully" });
    }
    catch (error) {
        console.error("Error scheduling tasks:", error);
        res.status(500).json({ error: "Failed to schedule tasks" });
    }
}));
// Route to cancel multiple tasks
app.post("/cancel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    const { reminderIds } = req.body;
    if (!reminderIds) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // For each reminder ID, cancel the task
    (0, scheduler_1.cancelTasks)(reminderIds);
}));
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
