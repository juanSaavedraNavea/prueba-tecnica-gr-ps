class SalesController {
  constructor({ listSalesUseCase, totalByRegionUseCase, topClientUseCase }) {
    this.listSalesUseCase = listSalesUseCase;
    this.totalByRegionUseCase = totalByRegionUseCase;
    this.topClientUseCase = topClientUseCase;

    this.list = this.list.bind(this);
    this.totalByRegion = this.totalByRegion.bind(this);
    this.topClient = this.topClient.bind(this);
  }

  async list(req, res) {
    const sales = await this.listSalesUseCase.execute(req.salesQuery);
    res.json({ data: sales, count: sales.length });
  }

  async totalByRegion(req, res) {
    const result = await this.totalByRegionUseCase.execute(req.salesQuery);
    res.json({ data: result });
  }

  async topClient(req, res) {
    const result = await this.topClientUseCase.execute(req.salesQuery);
    res.json({ data: result });
  }
}

module.exports = { SalesController };