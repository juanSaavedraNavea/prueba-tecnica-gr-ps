function buildQuery(params) {
  const query = new URLSearchParams();

  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  if (params.cliente) query.set("cliente", params.cliente);
  if (params.region) query.set("region", params.region);

  return query.toString();
}

async function request(path, params) {
  const query = buildQuery(params);
  const url = query ? `${path}?${query}` : path;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getSales(params) {
  return request("/api/sales", params);
}

export function getByRegion(params) {
  return request("/api/sales/by-region", params);
}

export function getTopClient(params) {
  return request("/api/sales/top-client", params);
}

export function getClients(params) {
  return request("/api/sales/clients", params);
}

export function getRegions(params) {
  return request("/api/sales/regions", params);
}
