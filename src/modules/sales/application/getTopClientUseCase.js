const { assertImplementsSalesRepository } = require("../domain/salesRepository");

class GetTopClientUseCase {
  constructor(repo) {
    assertImplementsSalesRepository(repo);
    this.repo = repo;
  }

  async execute(query) {
    const sales = await this.repo.list(query);

    const totalsByClient = sales.reduce((acc, s) => {
      acc[s.cliente] = (acc[s.cliente] || 0) + s.monto;
      return acc;
    }, {});

    let top = null; // { cliente, total }

    for (const [cliente, total] of Object.entries(totalsByClient)) {
      if (!top || total > top.total) top = { cliente, total };
    }

    return top; // si no hay ventas, devuelve null
  }
}

module.exports = { GetTopClientUseCase };