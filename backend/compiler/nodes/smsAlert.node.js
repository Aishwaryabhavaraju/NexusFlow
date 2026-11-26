const { tap } = require("rxjs/operators");

const createSmsAlert = (node, context = {}) => {
  const { message } = node.data || {};

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("SMS Alert requires a message");
  }

  return source$ =>
    source$.pipe(
      tap(event => {
        const alert = {
          type: "SMS_ALERT",
          nodeId: node.id,
          deviceId: event.deviceId,
          metric: event.metric,
          value: event.value,
          timestamp: event.timestamp,
          message
        };

        console.log("\n========== MOCK SMS ==========");
        console.log("Device:", alert.deviceId);
        console.log("Metric:", alert.metric);
        console.log("Value:", alert.value);
        console.log("Message:", alert.message);
        console.log("==============================\n");

        if (typeof context.sendAlert === "function") {
          context.sendAlert(alert);
        }
      })
    );
};

module.exports = createSmsAlert;

