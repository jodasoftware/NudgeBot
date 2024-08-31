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
exports.cancelTasks = exports.scheduleTask = void 0;
const axios_1 = __importDefault(require("axios"));
const redisClient_1 = __importDefault(require("./redisClient"));
const scheduleTask = (reminder) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const delay = reminder.date.getTime() - now.getTime();
    yield redisClient_1.default.add({
        title: reminder.title,
        body: reminder.body,
        userId: reminder.userId,
    }, { delay });
});
exports.scheduleTask = scheduleTask;
const cancelTasks = (reminderIds) => __awaiter(void 0, void 0, void 0, function* () {
    for (const reminderId of reminderIds) {
        yield redisClient_1.default.removeJobs(reminderId);
    }
});
exports.cancelTasks = cancelTasks;
redisClient_1.default.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Now sending reminder:`, job.data);
    try {
        const response = yield axios_1.default.post("http://api.moneymemo.app/notifications/send", job.data);
        console.log(`HTTP request succeeded:`, response.status);
    }
    catch (error) {
        console.error(`HTTP request to failed:`, error);
    }
    // Optionally remove the task from Redis once executed
    yield job.remove();
}));
