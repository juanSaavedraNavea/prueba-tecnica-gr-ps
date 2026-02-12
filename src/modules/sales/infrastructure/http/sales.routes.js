const { Router } = require("express");
const { asyncHandler } = require("../../../../shared/http/asyncHandler");
const { SALES_SEED } = require("../data/seed");
const { InMemorySalesRepository } = require("../data/inMemorySalesRepository");

const { ListSalesUseCase } = require("../../application/listSalesUseCase");
const { GetSalesTotalByRegionUseCase } = require("../../application/getSalesTotalByRegionUseCase");
const { GetTopClientUseCase } = require("../../application/getTopClientUseCase");
const { GetClientsUseCase } = require("../../application/getClientsUseCase");
const { GetRegionsUseCase } = require("../../application/getRegionsUseCase");

const { SalesController } = require("./salesController");
const { mapSalesQuery } = require("./salesMapper");

const salesRouter = Router();

// composition root del módulo
const repo = new InMemorySalesRepository(SALES_SEED);

const listSalesUseCase = new ListSalesUseCase(repo);
const totalByRegionUseCase = new GetSalesTotalByRegionUseCase(repo);
const topClientUseCase = new GetTopClientUseCase(repo);
const listClientsUseCase = new GetClientsUseCase(repo);
const listRegionsUseCase = new GetRegionsUseCase(repo);

const controller = new SalesController({
  listSalesUseCase,
  totalByRegionUseCase,
  topClientUseCase,
  listClientsUseCase,
  listRegionsUseCase,
});

salesRouter.use((req, _res, next) => {
  req.salesQuery = mapSalesQuery(req.query);
  next();
});

/**
 * @openapi
 * /sales:
 *   get:
 *     summary: Listar ventas (con filtros opcionales)
 *     parameters:
 *       - $ref: '#/components/parameters/FromDate'
 *       - $ref: '#/components/parameters/ToDate'
 *       - $ref: '#/components/parameters/Cliente'
 *       - $ref: '#/components/parameters/Region'
 *       - $ref: '#/components/parameters/MinMonto'
 *       - $ref: '#/components/parameters/MaxMonto'
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesListResponse'
 */
salesRouter.get("/", asyncHandler(controller.list));

/**
 * @openapi
 * /sales/by-region:
 *   get:
 *     summary: Obtener total de ventas por región
 *     parameters:
 *       - $ref: '#/components/parameters/FromDate'
 *       - $ref: '#/components/parameters/ToDate'
 *     responses:
 *       200:
 *         description: Totales por región
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesByRegionResponse'
 */
salesRouter.get("/by-region", asyncHandler(controller.totalByRegion));

/**
 * @openapi
 * /sales/top-client:
 *   get:
 *     summary: Obtener cliente con mayor monto acumulado
 *     parameters:
 *       - $ref: '#/components/parameters/FromDate'
 *       - $ref: '#/components/parameters/ToDate'
 *     responses:
 *       200:
 *         description: Cliente top (o null si no hay ventas en el rango)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopClientResponse'
 */
salesRouter.get("/top-client", asyncHandler(controller.topClient));

/**
 * @openapi
 * /sales/clients:
 *   get:
 *     summary: Obtener lista de clientes disponibles para filtros
 *     parameters:
 *       - $ref: '#/components/parameters/FromDate'
 *       - $ref: '#/components/parameters/ToDate'
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
salesRouter.get("/clients", asyncHandler(controller.listClients));

/**
 * @openapi
 * /sales/regions:
 *   get:
 *     summary: Obtener lista de regiones disponibles para filtros
 *     parameters:
 *       - $ref: '#/components/parameters/FromDate'
 *       - $ref: '#/components/parameters/ToDate'
 *     responses:
 *       200:
 *         description: Lista de regiones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
salesRouter.get("/regions", asyncHandler(controller.listRegions));

module.exports = { salesRouter };
