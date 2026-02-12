const { Router } = require("express");
const { asyncHandler } = require("../../../../shared/http/asyncHandler");
const { SALES_SEED } = require("../data/seed");
const { InMemorySalesRepository } = require("../data/inMemorySalesRepository");

const { ListSalesUseCase } = require("../../application/listSalesUseCase");
const { GetSalesTotalByRegionUseCase } = require("../../application/getSalesTotalByRegionUseCase");
const { GetTopClientUseCase } = require("../../application/getTopClientUseCase");

const { SalesController } = require("./salesController");
const { mapSalesQuery } = require("./salesMapper");

const salesRouter = Router();

// composition root del módulo
const repo = new InMemorySalesRepository(SALES_SEED);

const listSalesUseCase = new ListSalesUseCase(repo);
const totalByRegionUseCase = new GetSalesTotalByRegionUseCase(repo);
const topClientUseCase = new GetTopClientUseCase(repo);

const controller = new SalesController({
  listSalesUseCase,
  totalByRegionUseCase,
  topClientUseCase,
});

// middleware: normaliza query (incluye rango fechas)
salesRouter.use((req, _res, next) => {
  req.salesQuery = mapSalesQuery(req.query);
  next();
});

// 2) Permitir filtrar ventas por rango de fechas (from/to)
salesRouter.get("/", asyncHandler(controller.list));

// 1) Total ventas por región
salesRouter.get("/by-region", asyncHandler(controller.totalByRegion));

// 3) Cliente con mayor monto acumulado
salesRouter.get("/top-client", asyncHandler(controller.topClient));

module.exports = { salesRouter };