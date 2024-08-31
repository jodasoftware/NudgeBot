// src/redisClient.ts
import Queue from "bull";

// Create a queue
const taskQueue = new Queue("taskQueue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

export default taskQueue;
