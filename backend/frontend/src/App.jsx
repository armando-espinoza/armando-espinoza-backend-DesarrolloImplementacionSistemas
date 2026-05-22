import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminLayout from "./componentes/AdminLayout";
import Register from "./Register";
import Ventas from "./componentes/Ventas";
import Nomina from "./Nomina";
import Finanzas from "./Finanzas";
import Login from "./login";
import OlvideContrasena from "./olvidecontrasena";

function OlvideWrapper() {                               // 👈 nuevo
  const navigate = useNavigate();
  return <ForgotPassword onBack={() => navigate("/login")} />;
}

function RutaPrivada({ children }) {
  const estaAutenticado = localStorage.getItem("token");
  return estaAutenticado ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
<Route path="/olvide-contrasena" element={<OlvideContrasena />} />      <Route
        path="/"
        element={
          <RutaPrivada>
            <AdminLayout />
          </RutaPrivada>
        }
      >
        <Route path="ventas" element={<Ventas />} />
        <Route path="nomina" element={<Nomina />} />
        <Route path="finanzas" element={<Finanzas />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;