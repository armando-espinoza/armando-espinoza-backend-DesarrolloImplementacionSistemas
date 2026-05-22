import { useState } from "react";
import "./componentes/EmpleadosTable.css";

const empleadosData = [
  { id: 1, nombre: "Kenji Tanaka",   puesto: "Chef Principal",     departamento: "Cocina",   salario: 18500, estado: "Activo",   turno: "Mañana" },
  { id: 2, nombre: "Yuki Sato",      puesto: "Sous Chef",          departamento: "Cocina",   salario: 14200, estado: "Activo",   turno: "Tarde"  },
  { id: 3, nombre: "Carla Mendoza",  puesto: "Cajera",             departamento: "Caja",     salario: 9800,  estado: "Activo",   turno: "Mañana" },
  { id: 4, nombre: "Luis Herrera",   puesto: "Mesero",             departamento: "Servicio", salario: 8500,  estado: "Activo",   turno: "Noche"  },
  { id: 5, nombre: "Ana García",     puesto: "Mesera",             departamento: "Servicio", salario: 8500,  estado: "Inactivo", turno: "Tarde"  },
  { id: 6, nombre: "Roberto Díaz",   puesto: "Ayudante de Cocina", departamento: "Cocina",   salario: 7200,  estado: "Activo",   turno: "Mañana" },
  { id: 7, nombre: "Sofía López",    puesto: "Hostess",            departamento: "Servicio", salario: 8000,  estado: "Activo",   turno: "Noche"  },
];

export default function EmpleadosTable() {
  const [busqueda, setBusqueda]       = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleados, setEmpleados]     = useState(empleadosData);
  const [nuevoEmp, setNuevoEmp]       = useState({
    nombre: "", puesto: "", departamento: "", salario: "", estado: "Activo", turno: "Mañana",
  });

  const empleadosFiltrados = empleados.filter(e => {
    const coincideBusqueda =
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.puesto.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === "Todos" || e.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const handleAgregar = () => {
    if (!nuevoEmp.nombre || !nuevoEmp.puesto) return;
    setEmpleados([...empleados, { ...nuevoEmp, id: empleados.length + 1, salario: Number(nuevoEmp.salario) }]);
    setNuevoEmp({ nombre: "", puesto: "", departamento: "", salario: "", estado: "Activo", turno: "Mañana" });
    setModalAbierto(false);
  };

  const handleEliminar = (id) => {
    setEmpleados(empleados.filter(e => e.id !== id));
  };

  return (
    <div className="et-container">
      <div className="et-header">
        <div>
          <h3 className="et-titulo">Empleados</h3>
          <p className="et-subtitulo">Gestión del personal activo e inactivo</p>
        </div>
        <button className="et-btn-agregar" onClick={() => setModalAbierto(true)}>
          + Nuevo Empleado
        </button>
      </div>

      <div className="et-controles">
        <input
          className="et-buscador"
          type="text"
          placeholder="Buscar por nombre o puesto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div className="et-filtros">
          {["Todos", "Activo", "Inactivo"].map(f => (
            <button
              key={f}
              className={`et-filtro-btn ${filtroEstado === f ? "activo" : ""}`}
              onClick={() => setFiltroEstado(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="et-tabla-wrapper">
        <table className="et-tabla">
          {/* ── colgroup: define anchos fijos por columna ── */}
          <colgroup>
            <col /> {/* Empleado */}
            <col /> {/* Puesto */}
            <col /> {/* Departamento */}
            <col /> {/* Turno */}
            <col /> {/* Salario */}
            <col /> {/* Estado */}
            <col /> {/* Acciones */}
          </colgroup>

          <thead>
            <tr>
              <th>Empleado</th>
              <th>Puesto</th>
              <th>Departamento</th>
              <th>Turno</th>
              <th>Salario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div className="et-avatar-row">
                    <div className="et-avatar">{emp.nombre.charAt(0)}</div>
                    <span>{emp.nombre}</span>
                  </div>
                </td>
                <td>{emp.puesto}</td>
                <td><span className="et-badge-dept">{emp.departamento}</span></td>
                <td>{emp.turno}</td>
                <td className="et-salario">${emp.salario.toLocaleString()}</td>
                <td>
                  <span className={`et-estado ${emp.estado === "Activo" ? "activo" : "inactivo"}`}>
                    {emp.estado}
                  </span>
                </td>
                <td>
                  <button className="et-btn-eliminar" onClick={() => handleEliminar(emp.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {empleadosFiltrados.length === 0 && (
          <p className="et-vacio">No se encontraron empleados.</p>
        )}
      </div>

      {/* ── MODAL ── */}
      {modalAbierto && (
        <div className="et-modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="et-modal" onClick={e => e.stopPropagation()}>
            <h3 className="et-modal-titulo">Nuevo Empleado</h3>
            <div className="et-modal-campos">
              <input className="et-input" placeholder="Nombre completo"   value={nuevoEmp.nombre}        onChange={e => setNuevoEmp({ ...nuevoEmp, nombre:        e.target.value })} />
              <input className="et-input" placeholder="Puesto"            value={nuevoEmp.puesto}        onChange={e => setNuevoEmp({ ...nuevoEmp, puesto:        e.target.value })} />
              <input className="et-input" placeholder="Departamento"      value={nuevoEmp.departamento}  onChange={e => setNuevoEmp({ ...nuevoEmp, departamento:  e.target.value })} />
              <input className="et-input" placeholder="Salario mensual"   type="number" value={nuevoEmp.salario} onChange={e => setNuevoEmp({ ...nuevoEmp, salario: e.target.value })} />
              <select className="et-input" value={nuevoEmp.turno}   onChange={e => setNuevoEmp({ ...nuevoEmp, turno:  e.target.value })}>
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
              </select>
              <select className="et-input" value={nuevoEmp.estado}  onChange={e => setNuevoEmp({ ...nuevoEmp, estado: e.target.value })}>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            <div className="et-modal-botones">
              <button className="et-btn-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button className="et-btn-agregar"  onClick={handleAgregar}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
