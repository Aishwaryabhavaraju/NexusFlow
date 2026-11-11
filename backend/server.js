const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
=====================================
    NEXUSFLOW BACKEND SERVER
=====================================
Status: Running
Port: ${PORT}
URL: http://localhost:${PORT}
=====================================
`);
});

// Handle unexpected errors
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  server.close(() => process.exit(1));
});

