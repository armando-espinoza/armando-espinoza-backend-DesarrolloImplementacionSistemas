import { useState } from "react";
import "./componentes/Finanzas.css";

const transaccionesData = [
  { id: 1, descripcion: "Compra de insumos - Pescado", categoria: "Insumos",     monto: 8200,  fecha: "07 Mar 2026", tipo: "Egreso"  },
  { id: 2, descripcion: "Ventas del día - Domingo",    categoria: "Ventas",      monto: 18460, fecha: "07 Mar 2026", tipo: "Ingreso" },
  { id: 3, descripcion: "Pago renta local",            categoria: "Renta",       monto: 15000, fecha: "05 Mar 2026", tipo: "Egreso"  },
  { id: 4, descripcion: "Ventas del día - Sábado",     categoria: "Ventas",      monto: 24800, fecha: "06 Mar 2026", tipo: "Ingreso" },
  { id: 5, descripcion: "Pago nómina quincena",        categoria: "Nómina",      monto: 35800, fecha: "01 Mar 2026", tipo: "Egreso"  },
  { id: 6, descripcion: "Compra vajilla y utensilios", categoria: "Equipamiento",monto: 4500,  fecha: "02 Mar 2026", tipo: "Egreso"  },
  { id: 7, descripcion: "Ventas del día - Viernes",    categoria: "Ventas",      monto: 22000, fecha: "05 Mar 2026", tipo: "Ingreso" },
  { id: 8, descripcion: "Publicidad en redes",         categoria: "Marketing",   monto: 1500,  fecha: "03 Mar 2026", tipo: "Egreso"  },
];

const KPI_DATA = [
  { label: "Ingresos Mes",  valor: "$122,260", cambio: "+12.4%", positivo: true,  icono: "📈" },
  { label: "Egresos Mes",   valor: "$65,000",  cambio: "+5.2%",  positivo: false, icono: "📉" },
  { label: "Utilidad Neta", valor: "$57,260",  cambio: "+18.7%", positivo: true,  icono: "💰" },
  { label: "Margen",        valor: "46.8%",    cambio: "+2.1pp", positivo: true,  icono: "📊" },
];

const CATEGORIAS_EGRESO = [
  { categoria: "Nómina",       monto: 35800, color: "#e8003a", },
  { categoria: "Insumos",      monto: 28000, color: "#ff6b35",   },
  { categoria: "Renta",        monto: 15000, color: "#ffaa00",   },
  { categoria: "Equipamiento", monto: 4500,  color: "#00cc66",   },
  { categoria: "Marketing",    monto: 1500,  color: "#4488ff",   },
];

export default function Finanzas() {
  const [transacciones, setTransacciones] = useState(transaccionesData);
  const [filtroTipo, setFiltroTipo]       = useState("Todos");
  const [modalAbierto, setModalAbierto]   = useState(false);
  const [nueva, setNueva] = useState({ descripcion: "", categoria: "", tipo: "Ingreso", monto: "", fecha: "" });

  const totalEgresos = CATEGORIAS_EGRESO.reduce((a, b) => a + b.monto, 0);

  const filtradas = transacciones.filter(t =>
    filtroTipo === "Todos" || t.tipo === filtroTipo
  );

  const agregarTransaccion = () => {
    if (!nueva.descripcion || !nueva.monto) return;
    setTransacciones([{ ...nueva, id: transacciones.length + 1, monto: parseFloat(nueva.monto) }, ...transacciones]);
    setNueva({ descripcion: "", categoria: "", tipo: "Ingreso", monto: "", fecha: "" });
    setModalAbierto(false);
  };

  const fmt = n => `$${Number(n).toLocaleString()}`;

  const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const date = new Date(fechaStr);
  return date.toLocaleDateString("es-ES", { 
    day: "2-digit", 
    month: "short", 
    year: "numeric" 
  }).replace(".", ""); // Ajuste para que coincida con tu formato actual
};


  return (
    <div className="fin-page">
      <div className="fin-topbar">
        <div>
          <h2 className="fin-titulo">Finanzas</h2>
          <p className="fin-subtitulo">Control de ingresos, egresos y utilidades</p>
        </div>
        <button className="fin-btn-nueva" onClick={() => setModalAbierto(true)}>+ Nueva Transacción</button>
      </div>

      {/* KPIs */}
      <div className="fin-kpis">
        {KPI_DATA.map((k, i) => (
          <div className="fin-kpi" key={i}>
            <div className="fin-kpi-top">
              <span className="fin-kpi-label">{k.label}</span>
              <span className="fin-kpi-icono">{k.icono}</span>
            </div>
            <p className="fin-kpi-valor">{k.valor}</p>
            <p className={`fin-kpi-cambio ${k.positivo ? "pos" : "neg"}`}>
              {k.positivo ? "↑" : "↓"} {k.cambio} vs mes anterior
            </p>
          </div>
        ))}
      </div>

      {/* Desglose egresos — ocupa todo el ancho */}
      <div className="fin-card">
        <div className="fin-desglose-header">
          <div>
            <h3 className="fin-card-titulo">Desglose de Egresos</h3>
            <p className="fin-card-sub">Por categoría este mes · Total: {fmt(totalEgresos)}</p>
          </div>
        </div>

        <div className="fin-barras fin-barras-full">
          {CATEGORIAS_EGRESO.map((cat, i) => {
            const pct = ((cat.monto / totalEgresos) * 100).toFixed(1);
            return (
              <div key={i} className="fin-barra-row fin-barra-row-full">
                <div className="fin-barra-info">
                  <span className="fin-barra-label">{cat.categoria}</span>
                  <span className="fin-barra-desc">{cat.descripcion}</span>
                </div>
                <div className="fin-barra-track fin-barra-track-full">
                  <div
                    className="fin-barra-fill"
                    style={{ width: `${pct}%`, background: cat.color }}
                  />
                </div>
                <div className="fin-barra-nums">
                  <span className="fin-barra-monto">{fmt(cat.monto)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini resumen al pie */}
        
      </div>

      {/* Tabla transacciones — campos: Descripción, Categoría, Fecha, Monto */}
      <div className="fin-card">
        <div className="fin-tabla-header">
          <div>
            <h3 className="fin-card-titulo">Transacciones Recientes</h3>
            <p className="fin-card-sub">Registro de movimientos del período</p>
          </div>
          <div className="fin-filtros">
            {["Todos", "Ingreso", "Egreso"].map(f => (
              <button
                key={f}
                className={`fin-filtro-btn ${filtroTipo === f ? "activo" : ""}`}
                onClick={() => setFiltroTipo(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        <table className="fin-tabla">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(t => (
              <tr key={t.id}>
                <td>{t.descripcion}</td>
                <td><span className="fin-badge-cat">{t.categoria}</span></td>
                <td className="fin-fecha">{formatearFecha(t.fecha)}</td>
                <td className={`fin-monto ${t.tipo === "Ingreso" ? "ingreso" : "egreso"}`}>
                  {t.tipo === "Egreso" ? "-" : "+"}{fmt(t.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fin-modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="fin-modal" onClick={e => e.stopPropagation()}>
            <h3 className="fin-modal-titulo">Nueva Transacción</h3>
            <div className="fin-modal-campos">
              <input className="fin-input" placeholder="Descripción" value={nueva.descripcion} onChange={e => setNueva({...nueva, descripcion: e.target.value})} />
              <input className="fin-input" placeholder="Categoría"   value={nueva.categoria}   onChange={e => setNueva({...nueva, categoria:   e.target.value})} />
              <select className="fin-input" value={nueva.tipo} onChange={e => setNueva({...nueva, tipo: e.target.value})}>
                <option>Ingreso</option>
                <option>Egreso</option>
              </select>
              <input className="fin-input" placeholder="Monto" type="number" value={nueva.monto} onChange={e => setNueva({...nueva, monto: e.target.value})} />
              <input className="fin-input" type="date" value={nueva.fecha} onChange={e => setNueva({...nueva, fecha: e.target.value})} />
            </div>
            <div className="fin-modal-botones">
              <button className="fin-btn-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button className="fin-btn-nueva"    onClick={agregarTransaccion}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
