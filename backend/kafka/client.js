import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "127.0.0.1:9092").split(",");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "crm-backend",
  brokers,
  // ssl: true, // production
  // sasl: { mechanism: 'plain', username: process.env.KAFKA_USER, password: process.env.KAFKA_PASS }
});

export const testKafkaConnection = async () => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    await admin.disconnect();
    console.log("✅ Kafka is reachable");
    return true;
  } catch (err) {
    console.warn("⚠️ Kafka is not reachable:", err.message);
    return false;
  }
};

export default kafka;
