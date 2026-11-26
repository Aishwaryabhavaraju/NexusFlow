const { map } = require("rxjs/operators");

const createMathOperation = (node) => {
  const { operation, operand } = node.data || {};

  const supportedOperations = [
    "add",
    "subtract",
    "multiply",
    "divide"
  ];

  if (!supportedOperations.includes(operation)) {
    throw new Error(`Unsupported math operation: ${operation}`);
  }

  if (typeof operand !== "number" || !Number.isFinite(operand)) {
    throw new Error("Math operand must be a finite number");
  }

  if (operation === "divide" && operand === 0) {
    throw new Error("Division by zero is not allowed");
  }

  return source$ =>
    source$.pipe(
      map(event => {
        let result;

        switch (operation) {
          case "add":
            result = event.value + operand;
            break;

          case "subtract":
            result = event.value - operand;
            break;

          case "multiply":
            result = event.value * operand;
            break;

          case "divide":
            result = event.value / operand;
            break;
        }

        if (!Number.isFinite(result)) {
          throw new Error("Math operation produced an invalid value");
        }

        return {
          ...event,
          value: result
        };
      })
    );
};

module.exports = createMathOperation;

