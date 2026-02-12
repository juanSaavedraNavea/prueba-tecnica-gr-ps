function assertImplementsSalesRepository(repo) {
  if (!repo || typeof repo.list !== "function") {
    throw new Error("SalesRepository must implement method: list(query)");
  }
}

module.exports = { assertImplementsSalesRepository };