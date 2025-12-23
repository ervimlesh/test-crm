import pino from "pino";

const logger = pino({
  name: "notification-service",
  level: "info",
});

export default logger;
