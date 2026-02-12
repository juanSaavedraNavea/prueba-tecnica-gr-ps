const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sales API (Data Lake)",
    version: "1.0.0",
    description:
      "API interna para consultar ventas y generar agregaciones simples (por región y top cliente).",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" },
  ],
  components: {
    schemas: {
      Sale: {
        type: "object",
        properties: {
          cliente: { type: "string", example: "Empresa A" },
          monto: { type: "number", example: 150000 },
          fecha: { type: "string", example: "2025-01-10" },
          region: { type: "string", example: "Metropolitana" },
        },
        required: ["cliente", "monto", "fecha", "region"],
      },
      SalesListResponse: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Sale" } },
          count: { type: "number", example: 5 },
        },
      },
      SalesByRegionItem: {
        type: "object",
        properties: {
          region: { type: "string", example: "Metropolitana" },
          total: { type: "number", example: 699000 },
        },
        required: ["region", "total"],
      },
      SalesByRegionResponse: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/SalesByRegionItem" } },
        },
      },
      TopClientResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            nullable: true,
            properties: {
              cliente: { type: "string", example: "Empresa D" },
              total: { type: "number", example: 450000 },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
    },
    parameters: {
      FromDate: {
        in: "query",
        name: "from",
        schema: { type: "string", example: "2025-01-01" },
        description: "Fecha inicio (YYYY-MM-DD).",
        required: false,
      },
      ToDate: {
        in: "query",
        name: "to",
        schema: { type: "string", example: "2025-01-31" },
        description: "Fecha fin (YYYY-MM-DD).",
        required: false,
      },
      Cliente: {
        in: "query",
        name: "cliente",
        schema: { type: "string", example: "Empresa A" },
        required: false,
      },
      Region: {
        in: "query",
        name: "region",
        schema: { type: "string", example: "Metropolitana" },
        required: false,
      },
      MinMonto: {
        in: "query",
        name: "minMonto",
        schema: { type: "number", example: 100000 },
        required: false,
      },
      MaxMonto: {
        in: "query",
        name: "maxMonto",
        schema: { type: "number", example: 300000 },
        required: false,
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
