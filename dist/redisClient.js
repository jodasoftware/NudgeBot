"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/redisClient.ts
const bull_1 = __importDefault(require("bull"));
// Create a queue
const taskQueue = new bull_1.default("taskQueue", {
    redis: { host: "127.0.0.1", port: 6379 },
});
exports.default = taskQueue;
