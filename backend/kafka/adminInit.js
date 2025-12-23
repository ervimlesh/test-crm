import kafka from "./client.js";
import { fileURLToPath } from "url";

export const createTopics = async () => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [
        { topic: "user.events", numPartitions: 6, replicationFactor: 1 },
        { topic: "user.events.dlq", numPartitions: 3, replicationFactor: 1 },
        { topic: "notification.commands", numPartitions: 3, replicationFactor: 1 },
        { topic: "audit.events", numPartitions: 6, replicationFactor: 1 },
      ],
      waitForLeaders: true,
    });
    await admin.disconnect();
    console.log("✅ Topics created");
  } catch (err) {
    console.warn("⚠️ Kafka topics creation failed. Skipping:", err.message);
  }
};

// ES module equivalent of `if (require.main === module)`
const __filename = fileURLToPath(import.meta.url);

if (__filename === process.argv[1]) {
  createTopics();
}
