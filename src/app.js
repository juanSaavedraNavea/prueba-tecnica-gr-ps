const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./config/swagger");

const { salesRouter } = require("./modules/sales/infrastructure/http/sales.routes");
const { errorMiddleware } = require("./shared/errors/errorMiddleware");

function createServer() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/sales", salesRouter);

  app.use(errorMiddleware);

  return app;
}

module.exports = { createServer };
