const { assertImplementsSalesRepository } = require("../domain/salesRepository");

class GetSalesTotalByRegionUseCase {
  constructor(repo) {
    assertImplementsSalesRepository(repo);
    this.repo = repo;
  }

  async execute(query) {
    const sales = await this.repo.list(query);

    const totals = sales.reduce((acc, s) => {
      acc[s.region] = (acc[s.region] || 0) + s.monto;
      return acc;
    }, {});

    // formato amigable para frontend
    return Object.entries(totals)
      .map(([region, total]) => ({ region, total }))
      .sort((a, b) => b.total - a.total);
  }
}

module.exports = { GetSalesTotalByRegionUseCase };