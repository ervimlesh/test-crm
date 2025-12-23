import kafka from "./client.js";
import { v4 as uuidv4 } from "uuid";

let producer = null;

export const initProducer = async () => {
  if (producer) return producer;

  try {
    producer = kafka.producer({ allowAutoTopicCreation: false, idempotent: true });
    await producer.connect();
    console.log("✅ Kafka producer initialized");
    return producer;
  } catch (err) {
    console.warn("⚠️ Kafka producer init failed. Running without Kafka:", err.message);
    producer = null;
    return null;
  }
};

export const sendEvent = async (topic, type, payload, opts = {}) => {

  console.log("topic:", topic);
  console.log("type:", type);
  console.log("payload:", payload);


   
  if (!producer) {
    console.warn("⚠️ Kafka producer not connected. Event skipped:", type);
    return null;
  }
 console.log("it is calling successfully");
  const eventId = opts.key || uuidv4();
  const message = {
    key: opts.key || payload.userId || eventId,
    value: JSON.stringify({
      meta: { id: eventId, type, version: opts.version || 1, timestamp: new Date().toISOString(), source: process.env.SERVICE_NAME || "auth-service" },
      payload,
    }),
    headers: opts.headers || {},
  };

  await producer.send({ topic, messages: [message], acks: -1 });

  console.log(`✅ Kafka event sent: ${type} (topic: ${topic}, key: ${message.key})`);
  return message;
};

export const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
};
