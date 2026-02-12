class InMemorySalesRepository {
  constructor(data) {
    this.data = Array.isArray(data) ? data : [];
  }

  async list(query) {
    const q = query || {};

    return this.data.filter((s) => {
      if (q.cliente && s.cliente !== q.cliente) return false;
      if (q.region && s.region !== q.region) return false;


      if (q.from && s.fecha < q.from) return false;
      if (q.to && s.fecha > q.to) return false;

      if (Number.isFinite(q.minMonto) && s.monto < q.minMonto) return false;
      if (Number.isFinite(q.maxMonto) && s.monto > q.maxMonto) return false;

      return true;
    });
  }
}

module.exports = { InMemorySalesRepository };