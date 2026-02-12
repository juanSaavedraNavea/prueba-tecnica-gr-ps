function toNumberOrUndefined(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function mapSalesQuery(q) {
  // req.query siempre viene como string (o array), así que normalizamos
  return {
    cliente: typeof q.cliente === "string" ? q.cliente : undefined,
    region: typeof q.region === "string" ? q.region : undefined,
    from: typeof q.from === "string" ? q.from : undefined,
    to: typeof q.to === "string" ? q.to : undefined,
    minMonto: toNumberOrUndefined(q.minMonto),
    maxMonto: toNumberOrUndefined(q.maxMonto),
  };
}

module.exports = { mapSalesQuery };