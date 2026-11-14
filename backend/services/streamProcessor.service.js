const {
  processedTelemetry$
} = require("./telemetryStream.service");

let telemetrySubscription = null;

// Start listening to processed telemetry
const startStreamProcessor = () => {
  if (telemetrySubscription) {
    console.log("Stream processor is already running");
    return;
  }

  telemetrySubscription = processedTelemetry$.subscribe({
    next: (data) => {
      console.log("NexusFlow received telemetry:", data);

      // Later, pass this data to the RxJS rule compiler.
      // Example:
      // streamCompiler.execute(data);
    },

    error: (error) => {
      console.error("Telemetry stream error:", error);
      telemetrySubscription = null;
    },

    complete: () => {
      console.log("Telemetry stream completed");
      telemetrySubscription = null;
    }
  });

  console.log("NexusFlow stream processor started");
};

// Stop listening when required
const stopStreamProcessor = () => {
  if (telemetrySubscription) {
    telemetrySubscription.unsubscribe();
    telemetrySubscription = null;
    console.log("NexusFlow stream processor stopped");
  }
};

module.exports = {
  startStreamProcessor,
  stopStreamProcessor
};

