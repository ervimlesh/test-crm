// kafka/consumer.js
import kafka from "./client.js";
import pino from "pino";

const logger = pino();

export const createConsumer = ({ groupId }) => kafka.consumer({ groupId });

/**
 * Run a consumer; if Kafka not available, do retries and return null instead of throwing.
 * handler: async ({topic, partition, message}) => {}
 */
export const runConsumer = async ({ topics = [], groupId, handler, options = {} }) => {
  const MAX_RETRIES = parseInt(process.env.KAFKA_CONSUMER_CONNECT_RETRIES || "6", 10);
  const BASE_DELAY_MS = parseInt(process.env.KAFKA_CONSUMER_RETRY_DELAY_MS || "2000", 10);

  let consumer = createConsumer({ groupId });

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await consumer.connect();
      for (const t of topics) {
        await consumer.subscribe({
          topic: t,
          fromBeginning: !!options.fromBeginning,
        });
      }

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            await handler({ topic, partition, message });
          } catch (err) {
            logger.error({ err, topic, partition }, "Error processing message");
            // swallow or handle as needed; don't crash the whole service
          }
        },
      });

      console.log(`✅ Consumer connected (groupId=${groupId}) and subscribed to: ${topics.join(", ")}`);
      return consumer;
    } catch (err) {
      const backoff = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(`Consumer connect attempt ${attempt + 1} failed: ${err.message || err}. retrying in ${backoff}ms`);
      await wait(backoff);
    }
  }

  console.error("Consumer failed to connect after retries — continuing without consumer(s).");
  return null;
};
