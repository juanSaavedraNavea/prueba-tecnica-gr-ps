const { assertImplementsSalesRepository } = require("../domain/salesRepository");

class GetClientsUseCase {
  constructor(repo) {
    assertImplementsSalesRepository(repo);
    this.repo = repo;
  }

  async execute(query) {
    const sales = await this.repo.list(query);
    return [...new Set(sales.map((s) => s.cliente))].sort((a, b) => a.localeCompare(b));
  }
}

module.exports = { GetClientsUseCase };
