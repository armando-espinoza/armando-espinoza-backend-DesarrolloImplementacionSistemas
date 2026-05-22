import EmpleadosTable from "./EmpleadosTable";
import CalculadoraPago from "./CalculadoraPago";
import PeriodosNomina from "./Periodosnomina";
export default function Nomina() {
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#e8e8e8", margin: 0 }}>Nómina</h2>
        <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Gestión de empleados y pagos</p>
      </div>
      <EmpleadosTable />
      <CalculadoraPago />
      <PeriodosNomina />
    </div>
  );
}
