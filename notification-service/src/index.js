import { startNotificationConsumer } from "./consumer.js";
import logger from "./logger.js";

(async () => {
  try {
    await startNotificationConsumer();
    logger.info("🚀 Notification Service Running...");
  } catch (err) {
    logger.error({ err }, "❌ Failed to start Notification Service");
  }
})();
