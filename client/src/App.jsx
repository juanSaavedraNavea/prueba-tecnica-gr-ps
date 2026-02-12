import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getByRegion, getClients, getRegions, getSales, getTopClient } from "./api";

const moneyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

function getClientRanking(sales) {
  const totals = sales.reduce((acc, sale) => {
    acc[sale.cliente] = (acc[sale.cliente] || 0) + sale.monto;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total);
}

function toSelectOptions(values) {
  return values.map((value) => ({ value, label: value }));
}

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: 38,
    borderRadius: 10,
    borderColor: "#bfcee8",
    boxShadow: "none",
    ":hover": { borderColor: "#93c5fd" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#1d4ed8" : state.isFocused ? "#dbeafe" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

export default function App() {
  const menuPortalTarget = typeof document !== "undefined" ? document.body : null;

  const [filters, setFilters] = useState({
    from: "2025-01-01",
    to: "2025-12-31",
    cliente: "",
    region: "",
  });

  const [salesRange, setSalesRange] = useState([]);
  const [byRegionRange, setByRegionRange] = useState([]);
  const [topClientRange, setTopClientRange] = useState(null);
  const [clients, setClients] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setLoadingOptions(true);
      try {
        const query = { from: filters.from, to: filters.to };
        const [clientsRes, regionsRes] = await Promise.all([getClients(query), getRegions(query)]);

        if (cancelled) return;

        const clientOptions = toSelectOptions(clientsRes.data || []);
        const regionOptions = toSelectOptions(regionsRes.data || []);

        setClients(clientOptions);
        setRegions(regionOptions);

        setFilters((prev) => {
          const next = { ...prev };

          if (prev.cliente && !clientOptions.some((option) => option.value === prev.cliente)) {
            next.cliente = "";
          }

          if (prev.region && !regionOptions.some((option) => option.value === prev.region)) {
            next.region = "";
          }

          return next;
        });
      } catch {
        if (!cancelled) {
          setClients([]);
          setRegions([]);
        }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    }

    loadOptions();
    return () => {
      cancelled = true;
    };
  }, [filters.from, filters.to]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const query = {
          from: filters.from,
          to: filters.to,
          cliente: filters.cliente,
          region: filters.region,
        };

        const [salesRes, byRegionRes, topClientRes] = await Promise.all([
          getSales(query),
          getByRegion(query),
          getTopClient(query),
        ]);

        if (cancelled) return;

        setSalesRange(salesRes.data || []);
        setByRegionRange(byRegionRes.data || []);
        setTopClientRange(topClientRes.data || null);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unexpected error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [filters.from, filters.to, filters.cliente, filters.region]);

  const totalSales = useMemo(
    () => salesRange.reduce((acc, sale) => acc + sale.monto, 0),
    [salesRange],
  );

  const clientRanking = useMemo(() => getClientRanking(salesRange), [salesRange]);

  const chartData = clientRanking.map((item) => ({
    cliente: item.cliente,
    total: item.total,
  }));

  const topClient = topClientRange || clientRanking[0] || null;
  const secondClient = clientRanking[1] || null;
  const topRegion = byRegionRange[0] || null;
  const secondRegion = byRegionRange[1] || null;

  const selectedClientOption = clients.find((option) => option.value === filters.cliente) || null;
  const selectedRegionOption = regions.find((option) => option.value === filters.region) || null;

  return (
    <main className="page">
      <section className="hero">
        <h1>Sales Dashboard</h1>
        <p>Consulta ventas, filtra por fechas, cliente y region, y visualiza indicadores clave.</p>
      </section>

      <section className="panel filters">
        <div className="field">
          <label htmlFor="from">Desde</label>
          <input
            id="from"
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
          />
        </div>

        <div className="field">
          <label htmlFor="to">Hasta</label>
          <input
            id="to"
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
          />
        </div>

        <div className="field">
          <label htmlFor="clientSelect">Cliente</label>
          <Select
            inputId="clientSelect"
            classNamePrefix="filter-select"
            isClearable
            isSearchable
            isLoading={loadingOptions}
            options={clients}
            placeholder="Selecciona cliente"
            noOptionsMessage={() => "Sin opciones"}
            value={selectedClientOption}
            styles={selectStyles}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            onChange={(option) =>
              setFilters((prev) => ({
                ...prev,
                cliente: option?.value || "",
              }))
            }
          />
        </div>

        <div className="field">
          <label htmlFor="regionSelect">Region</label>
          <Select
            inputId="regionSelect"
            classNamePrefix="filter-select"
            isClearable
            isSearchable
            isLoading={loadingOptions}
            options={regions}
            placeholder="Selecciona region"
            noOptionsMessage={() => "Sin opciones"}
            value={selectedRegionOption}
            styles={selectStyles}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            onChange={(option) =>
              setFilters((prev) => ({
                ...prev,
                region: option?.value || "",
              }))
            }
          />
        </div>
      </section>

      {error && (
        <section className="panel error">
          <strong>Error:</strong> {error}
        </section>
      )}

      {loading ? (
        <section className="panel">Cargando datos...</section>
      ) : (
        <>
          <section className="kpi-grid">
            <article className="panel kpi">
              <h2>Cliente Top 1 / 2</h2>
              <p>{topClient ? `${topClient.cliente}: ${moneyFormatter.format(topClient.total)}` : "Sin datos"}</p>
              <p>
                {secondClient
                  ? `${secondClient.cliente}: ${moneyFormatter.format(secondClient.total)}`
                  : "Sin segundo cliente"}
              </p>
            </article>

            <article className="panel kpi">
              <h2>Total Ventas</h2>
              <p className="big">{moneyFormatter.format(totalSales)}</p>
              <small>{salesRange.length} registros visibles</small>
            </article>

            <article className="panel kpi">
              <h2>Region Top 1 / 2</h2>
              <p>{topRegion ? `${topRegion.region}: ${moneyFormatter.format(topRegion.total)}` : "Sin datos"}</p>
              <p>
                {secondRegion
                  ? `${secondRegion.region}: ${moneyFormatter.format(secondRegion.total)}`
                  : "Sin segunda region"}
              </p>
            </article>
          </section>

          <section className="panel chart-wrap">
            <h2>Ventas por Cliente</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cliente" />
                  <YAxis />
                  <Tooltip formatter={(value) => moneyFormatter.format(value)} />
                  <Legend />
                  <Bar dataKey="total" fill="#1d4ed8" name="Ventas" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel table-wrap">
            <h2>Detalle de Ventas</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Region</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRange.map((sale, index) => (
                    <tr key={`${sale.cliente}-${sale.fecha}-${index}`}>
                      <td>{sale.cliente}</td>
                      <td>{sale.region}</td>
                      <td>{sale.fecha}</td>
                      <td>{moneyFormatter.format(sale.monto)}</td>
                    </tr>
                  ))}
                  {salesRange.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-row">
                        No hay datos para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
