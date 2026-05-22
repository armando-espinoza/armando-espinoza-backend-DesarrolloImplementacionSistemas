import React, { useState } from "react";
import "./Ventas.css";

const ventasData = {
  "7d": [
    { day: "Lun", sales: 12400, orders: 98  },
    { day: "Mar", sales: 15800, orders: 120 },
    { day: "Mié", sales: 11200, orders: 87  },
    { day: "Jue", sales: 17600, orders: 138 },
    { day: "Vie", sales: 22000, orders: 175 },
    { day: "Sáb", sales: 24800, orders: 196 },
    { day: "Hoy", sales: 18460, orders: 134 },
  ],
  "30d": [
    { day: "S1", sales: 88000,  orders: 620 },
    { day: "S2", sales: 102000, orders: 740 },
    { day: "S3", sales: 95000,  orders: 690 },
    { day: "S4", sales: 118000, orders: 830 },
  ],
  "3m": [
    { day: "Ene", sales: 320000, orders: 2400 },
    { day: "Feb", sales: 295000, orders: 2180 },
    { day: "Mar", sales: 182000, orders: 1340 },
  ],
};

function getFechaActual() {
  const ahora = new Date();
  const dias  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${dias[ahora.getDay()]} ${ahora.getDate()} ${meses[ahora.getMonth()]}, ${ahora.getFullYear()}`;
}

export default function Ventas() {
  const [seg, setSeg] = useState("7d");

  const data         = ventasData[seg];
  const maxS         = Math.max(...data.map((d) => d.sales));
  const maxO         = Math.max(...data.map((d) => d.orders));
  const totalVentas  = data.reduce((a, d) => a + d.sales,  0);
  const totalOrdenes = data.reduce((a, d) => a + d.orders, 0);
  const ticketProm   = Math.round(totalVentas / totalOrdenes);

  return (
    <div className="ventas-page">

      {/* ── HEADER ── */}
      <div className="ventas-header">
        <div>
          <h1 className="ventas-title">Inicio</h1>
          <p className="ventas-sub">売上管理 · Reporte de ingresos y rendimiento</p>
        </div>
        <div className="ventas-header-right">
          <div className="time-chip">📅 {getFechaActual()}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="kpi-row">
        <div className="kpi-card kc-red">
          <div className="kpi-bg-icon">💴</div>
          <div className="kpi-label">Total Ventas</div>
          <div className="kpi-val">${totalVentas.toLocaleString()}</div>
          <div className="kpi-delta"><span className="up">↑ 12.4%</span> vs período anterior</div>
        </div>
        <div className="kpi-card kc-gold">
          <div className="kpi-bg-icon">🧾</div>
          <div className="kpi-label">Total Órdenes</div>
          <div className="kpi-val">{totalOrdenes}</div>
          <div className="kpi-delta"><span className="up">↑ 8.1%</span> vs período anterior</div>
        </div>
        <div className="kpi-card kc-green">
          <div className="kpi-bg-icon">💳</div>
          <div className="kpi-label">Ticket Promedio</div>
          <div className="kpi-val">${ticketProm}</div>
          <div className="kpi-delta"><span className="up">↑ $12</span> vs período anterior</div>
        </div>
        <div className="kpi-card kc-blue">
          <div className="kpi-bg-icon">📈</div>
          <div className="kpi-label">Meta del Mes</div>
          <div className="kpi-val">76%</div>
          <div className="kpi-delta">$38,000 restantes</div>
        </div>
      </div>

      {/* ── GRÁFICA ── */}
      <div className="v-card">
        <div className="v-card-hd">
          <div>
            <div className="v-card-title">Ventas por Período</div>
            <div className="v-card-sub">Ingresos ($) y órdenes comparados</div>
          </div>
          <div className="seg-ctrl">
            {["7d", "30d", "3m"].map((s) => (
              <div
                key={s}
                className={`seg-btn${seg === s ? " on" : ""}`}
                onClick={() => setSeg(s)}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="bar-chart bar-chart-full">
          {data.map((d) => (
            <div className="bc-group" key={d.day}>
              <div className="bc-bars">
                <div
                  className="bc-bar bc-red"
                  style={{ height: `${Math.round((d.sales / maxS) * 118)}px` }}
                  title={`$${d.sales.toLocaleString()}`}
                />
                <div
                  className="bc-bar bc-gold"
                  style={{ height: `${Math.round((d.orders / maxO) * 118)}px` }}
                  title={`${d.orders} órdenes`}
                />
              </div>
              <div className="bc-label">{d.day}</div>
            </div>
          ))}
        </div>

        <div className="chart-legend">
          <div className="leg-item"><div className="leg-dot red-dot" />Ventas ($)</div>
          <div className="leg-item"><div className="leg-dot gold-dot" />Órdenes</div>
        </div>
      </div>

      {/* ── TABLA DETALLE ── */}
      <div className="v-card" style={{ marginTop: "20px" }}>
        <div className="v-card-hd">
          <div>
            <div className="v-card-title">Detalle de Ventas</div>
            <div className="v-card-sub">Registro por día del período seleccionado</div>
          </div>
        </div>

        <table className="ventas-table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Ventas ($)</th>
              <th>Órdenes</th>
              <th>Ticket Prom.</th>
              <th>Vs anterior</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              const prev = data[i - 1];
              const diff = prev != null ? d.sales - prev.sales : null;
              const pct  = prev != null ? ((diff / prev.sales) * 100).toFixed(1) : null;
              return (
                <tr key={d.day}>
                  <td className="td-day">{d.day}</td>
                  <td className="td-sales">${d.sales.toLocaleString()}</td>
                  <td>{d.orders}</td>
                  <td>${Math.round(d.sales / d.orders)}</td>
                  <td>
                    {pct !== null ? (
                      <span className={parseFloat(pct) >= 0 ? "badge-up" : "badge-down"}>
                        {parseFloat(pct) >= 0 ? "↑" : "↓"} {Math.abs(pct)}%
                      </span>
                    ) : (
                      <span className="badge-neutral">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
