class SalesController {
  constructor({
    listSalesUseCase,
    totalByRegionUseCase,
    topClientUseCase,
    listClientsUseCase,
    listRegionsUseCase,
  }) {
    this.listSalesUseCase = listSalesUseCase;
    this.totalByRegionUseCase = totalByRegionUseCase;
    this.topClientUseCase = topClientUseCase;
    this.listClientsUseCase = listClientsUseCase;
    this.listRegionsUseCase = listRegionsUseCase;

    this.list = this.list.bind(this);
    this.totalByRegion = this.totalByRegion.bind(this);
    this.topClient = this.topClient.bind(this);
    this.listClients = this.listClients.bind(this);
    this.listRegions = this.listRegions.bind(this);
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

  async listClients(req, res) {
    const result = await this.listClientsUseCase.execute(req.salesQuery);
    res.json({ data: result });
  }

  async listRegions(req, res) {
    const result = await this.listRegionsUseCase.execute(req.salesQuery);
    res.json({ data: result });
  }
}

module.exports = { SalesController };
