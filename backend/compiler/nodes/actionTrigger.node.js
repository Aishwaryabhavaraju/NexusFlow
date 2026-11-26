const { tap } = require("rxjs/operators");

const createActionTrigger = (node, context = {}) => {
  const {
    actionType = "alert",
    message
  } = node.data || {};

  if (actionType !== "alert") {
    throw new Error(`Unsupported action type: ${actionType}`);
  }

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Action Trigger requires an alert message");
  }

  return source$ =>
    source$.pipe(
      tap(event => {
        const alertEvent = {
          type: "ALERT_TRIGGERED",
          actionType,
          nodeId: node.id,
          deviceId: event.deviceId,
          metric: event.metric,
          value: event.value,
          timestamp: event.timestamp,
          message
        };

        console.log("\nACTION TRIGGERED!");
        console.log(alertEvent);

        if (typeof context.sendAlert === "function") {
          context.sendAlert(alertEvent);
        }
      })
    );
};

module.exports = createActionTrigger;

