const { assertImplementsSalesRepository } = require("../domain/salesRepository");

class ListSalesUseCase {
  constructor(repo) {
    assertImplementsSalesRepository(repo);
    this.repo = repo;
  }

  async execute(query) {
    // Aquí puedes agregar reglas de negocio/validaciones si el test lo pide.
    return this.repo.list(query);
  }
}

module.exports = { ListSalesUseCase };