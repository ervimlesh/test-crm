import { runConsumer } from "../../backend/kafka/consumer.js";
import { notificationHandler } from "./handler.js";
import logger from "./logger.js";

export const startNotificationConsumer = async () => {
  await runConsumer({
    topics: ["user.events"],
    groupId: "notification-service-group",
    handler: notificationHandler,
  });

  logger.info("🚀 Notification Consumer Started");
};
  


  