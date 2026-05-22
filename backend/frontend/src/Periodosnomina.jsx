import { useState } from "react";
import "./componentes/Periodosnomina.css";

const periodosIniciales = [
  { id: 1, periodo: "1 – 15 Mar 2026", empleados: 7, totalBruto: 41000, totalNeto: 35800, estado: "Pagado", fecha: "15 Mar 2026" },
  { id: 2, periodo: "16 – 28 Feb 2026", empleados: 7, totalBruto: 40500, totalNeto: 35400, estado: "Pagado", fecha: "28 Feb 2026" },
  { id: 3, periodo: "1 – 15 Feb 2026", empleados: 6, totalBruto: 37200, totalNeto: 32500, estado: "Pagado", fecha: "15 Feb 2026" },
  { id: 4, periodo: "16 – 31 Ene 2026", empleados: 6, totalBruto: 37200, totalNeto: 32400, estado: "Pagado", fecha: "31 Ene 2026" },
];

const periodoActual = {
  periodo: "16 – 31 Mar 2026",
  empleados: 7,
  totalBruto: 41500,
  totalNeto: 36200,
  estado: "Pendiente",
  fecha: "31 Mar 2026",
};

export default function PeriodosNomina() {
  const [historial, setHistorial] = useState(periodosIniciales);
  const [pendiente, setPendiente] = useState(periodoActual);

  const procesarPago = () => {
    const nuevo = { ...pendiente, id: historial.length + 1, estado: "Pagado" };
    setHistorial([nuevo, ...historial]);
    setPendiente({
      periodo: "1 – 15 Abr 2026",
      empleados: 7,
      totalBruto: 42000,
      totalNeto: 36700,
      estado: "Pendiente",
      fecha: "15 Abr 2026",
    });
  };

  const fmt = n => `$${n.toLocaleString()}`;

  return (
    <div className="pn-container">
      <div className="pn-header">
        <h3 className="pn-titulo">Períodos de Nómina</h3>
        <p className="pn-subtitulo">Historial y control de pagos quincenales</p>
      </div>

      {/* Período actual */}
      <div className="pn-actual">
        <div className="pn-actual-info">
          <span className="pn-badge pendiente">⏳ Período Actual</span>
          <h4 className="pn-actual-periodo">{pendiente.periodo}</h4>
          <div className="pn-actual-stats">
            <div className="pn-stat">
              <span className="pn-stat-label">Empleados</span>
              <span className="pn-stat-valor">{pendiente.empleados}</span>
            </div>
            <div className="pn-stat">
              <span className="pn-stat-label">Total Bruto</span>
              <span className="pn-stat-valor">{fmt(pendiente.totalBruto)}</span>
            </div>
            <div className="pn-stat">
              <span className="pn-stat-label">Total Neto</span>
              <span className="pn-stat-valor neto">{fmt(pendiente.totalNeto)}</span>
            </div>
            <div className="pn-stat">
              <span className="pn-stat-label">Fecha Límite</span>
              <span className="pn-stat-valor">{pendiente.fecha}</span>
            </div>
          </div>
        </div>
        <button className="pn-btn-procesar" onClick={procesarPago}>
          Procesar Pago →
        </button>
      </div>

      {/* Historial */}
      <div className="pn-historial-header">
        <p className="pn-historial-label">HISTORIAL DE PERÍODOS</p>
      </div>

      <div className="pn-lista">
        {historial.map(p => (
          <div key={p.id} className="pn-item">
            <div className="pn-item-left">
              <span className="pn-badge pagado">✓ Pagado</span>
              <span className="pn-item-periodo">{p.periodo}</span>
            </div>
            <div className="pn-item-right">
              <span className="pn-item-emp">{p.empleados} empleados</span>
              <span className="pn-item-bruto">{fmt(p.totalBruto)}</span>
              <span className="pn-item-neto">{fmt(p.totalNeto)} neto</span>
              <span className="pn-item-fecha">{p.fecha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
