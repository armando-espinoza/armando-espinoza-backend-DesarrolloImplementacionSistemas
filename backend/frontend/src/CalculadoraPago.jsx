import { useState } from "react";
import "./componentes/CalculadoraPago.css";

// Lista de empleados con sus salarios (tomados de EmpleadosTable)
const EMPLEADOS = [
  { id: 1, nombre: "Kenji Tanaka",   puesto: "Chef Principal",     salario: 18500 },
  { id: 2, nombre: "Yuki Sato",      puesto: "Sous Chef",          salario: 14200 },
  { id: 3, nombre: "Carla Mendoza",  puesto: "Cajera",             salario: 9800  },
  { id: 4, nombre: "Luis Herrera",   puesto: "Mesero",             salario: 8500  },
  { id: 5, nombre: "Ana García",     puesto: "Mesera",             salario: 8500  },
  { id: 6, nombre: "Roberto Díaz",   puesto: "Ayudante de Cocina", salario: 7200  },
  { id: 7, nombre: "Sofía López",    puesto: "Hostess",            salario: 8000  },
];

export default function CalculadoraPago() {
  const [empleadoId, setEmpleadoId] = useState("");
  const [horasExtra, setHorasExtra] = useState(0);
  const [resultado, setResultado]   = useState(null);

  const empleadoSeleccionado = EMPLEADOS.find(e => e.id === parseInt(empleadoId));

  const calcular = () => {
    if (!empleadoSeleccionado) return;

    const base         = empleadoSeleccionado.salario;
    const extra        = parseFloat(horasExtra) || 0;
    const valorHoraExtra = (base / 30 / 8) * 2;
    const totalExtra   = extra * valorHoraExtra;
    const totalPercepciones = base + totalExtra;

    setResultado({
      empleado: empleadoSeleccionado.nombre,
      salarioBase: base,
      horasExtraImporte: totalExtra,
      totalPercepciones,
    });
  };

  const fmt = (n) =>
    `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="cp-container">
      <div className="cp-header">
        <h3 className="cp-titulo">Calculadora de Pago</h3>
        <p className="cp-subtitulo">Calcula el salario neto del empleado</p>
      </div>

      <div className="cp-body">
        <div className="cp-form">

          {/* Selector de empleado */}
          <div className="cp-campo">
            <label className="cp-label">Empleado</label>
            <select
              className="cp-input cp-select"
              value={empleadoId}
              onChange={e => {
                setEmpleadoId(e.target.value);
                setResultado(null);
              }}
            >
              <option value="">— Selecciona un empleado —</option>
              {EMPLEADOS.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} · {emp.puesto}
                </option>
              ))}
            </select>
          </div>

          {/* Salario asignado (solo lectura) */}
          {empleadoSeleccionado && (
            <div className="cp-campo">
              <label className="cp-label">Salario Base Mensual</label>
              <div className="cp-input-prefix cp-readonly">
                <span>$</span>
                <input
                  className="cp-input"
                  type="text"
                  value={empleadoSeleccionado.salario.toLocaleString("es-MX")}
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Horas extra */}
          <div className="cp-campo">
            <label className="cp-label">Horas Extra</label>
            <input
              className="cp-input"
              type="number"
              placeholder="0"
              min="0"
              value={horasExtra}
              onChange={e => setHorasExtra(e.target.value)}
            />
          </div>

          <button
            className="cp-btn-calcular"
            onClick={calcular}
            disabled={!empleadoSeleccionado}
          >
            Calcular Nómina
          </button>
        </div>

        {resultado && (
          <div className="cp-resultado">
            <h4 className="cp-resultado-titulo">Desglose de Pago</h4>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
              {resultado.empleado}
            </p>

            <div className="cp-seccion">
              <p className="cp-seccion-label">PERCEPCIONES</p>
              <div className="cp-fila">
                <span>Salario Base</span>
                <span>{fmt(resultado.salarioBase)}</span>
              </div>
              <div className="cp-fila">
                <span>Horas Extra</span>
                <span>{fmt(resultado.horasExtraImporte)}</span>
              </div>
              <div className="cp-fila total">
                <span>Total Percepciones</span>
                <span>{fmt(resultado.totalPercepciones)}</span>
              </div>
            </div>

            <div className="cp-neto">
              <span>TOTAL A PAGAR</span>
              <span className="cp-neto-monto">{fmt(resultado.totalPercepciones)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
