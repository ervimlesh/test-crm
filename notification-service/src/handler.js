import logger from "./logger.js";
import { sendMail } from "./mail.service.js";

export const notificationHandler = async ({ topic, partition, message }) => {
  const val = message.value.toString();

  let parsed;
  try {
    parsed = JSON.parse(val);
  } catch {
    logger.error({ val }, "❌ Invalid JSON");
    return;
  }

  const { meta, payload } = parsed;

  if (!meta?.type) {
    logger.warn({ parsed }, "⚠️ Invalid event format");
    return;
  }

  logger.info({ event: meta.type }, "📩 Event Received");

  switch (meta.type) {
    case "OTP_SENT":
      await sendMail(
        payload.email,
        "Your OTP",
        `Your OTP is ${payload.otp}, valid for 5 minutes.`
      );
      break;

    default:
      logger.warn({ meta }, "⚠️ Unhandled event type");
  }
};
