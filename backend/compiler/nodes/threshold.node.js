const { filter } = require("rxjs/operators");

const createThreshold = (node) => {
  const { operator, value } = node.data || {};

  const supportedOperators = [
    "gt",
    "gte",
    "lt",
    "lte",
    "eq"
  ];

  if (!supportedOperators.includes(operator)) {
    throw new Error(`Unsupported threshold operator: ${operator}`);
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Threshold value must be a finite number");
  }

  return source$ =>
    source$.pipe(
      filter(event => {
        switch (operator) {
          case "gt":
            return event.value > value;

          case "gte":
            return event.value >= value;

          case "lt":
            return event.value < value;

          case "lte":
            return event.value <= value;

          case "eq":
            return event.value === value;

          default:
            return false;
        }
      })
    );
};

module.exports = createThreshold;

