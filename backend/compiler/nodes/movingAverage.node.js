const { scan, map } = require("rxjs/operators");

const createMovingAverage = (node) => {
  const { windowSize } = node.data || {};

  if (
    !Number.isInteger(windowSize) ||
    windowSize < 1 ||
    windowSize > 10000
  ) {
    throw new Error("Invalid moving average window size");
  }

  return source$ =>
    source$.pipe(
      scan(
        (state, event) => {
          if (state.count < windowSize) {
            state.buffer[state.index] = event.value;
            state.sum += event.value;
            state.count++;
          } else {
            state.sum -= state.buffer[state.index];
            state.buffer[state.index] = event.value;
            state.sum += event.value;
          }

          state.index = (state.index + 1) % windowSize;

          return {
            ...state,
            latestEvent: event,
            average: state.sum / state.count
          };
        },
        {
          buffer: new Array(windowSize),
          index: 0,
          count: 0,
          sum: 0,
          average: 0,
          latestEvent: null
        }
      ),

      map(state => ({
        ...state.latestEvent,
        rawValue: state.latestEvent.value,
        value: state.average,
        windowSize: state.count
      }))
    );
};

module.exports = createMovingAverage;

