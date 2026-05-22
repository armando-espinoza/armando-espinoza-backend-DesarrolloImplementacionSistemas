import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./componentes/login.css"; // reutiliza los mismos estilos del login

const OlvideContrasena = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1: email, 2: código, 3: nueva contraseña, 4: éxito
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");

  // Paso 1: Enviar correo
  const handleEnviarCorreo = (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }
    // Aquí iría la llamada a tu API para enviar el código
    console.log("Enviando código a:", email);
    setPaso(2);
  };

  // Paso 2: Verificar código
  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    setError("");
    if (!codigo) {
      setError("Por favor ingresa el código de verificación.");
      return;
    }
    // Aquí iría la validación real del código con tu API
    // Simulamos que el código "123456" es válido
    if (codigo !== "123456") {
      setError("Código incorrecto. Inténtalo de nuevo.");
      return;
    }
    setPaso(3);
  };

  // Paso 3: Nueva contraseña
  const handleNuevaContrasena = (e) => {
    e.preventDefault();
    setError("");
    if (!nuevaContrasena || !confirmarContrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    // Aquí iría la actualización real con tu API
    console.log("Contraseña actualizada para:", email);
    setPaso(4);
  };

  return (
    <div className="formulario">
      {/* ── Paso 1: Ingresar correo ── */}
      {paso === 1 && (
        <>
          <h1>Olvidé mi contraseña</h1>
          <p style={{ textAlign: "center", marginBottom: "1rem", color: "#555", fontSize: "0.9rem" }}>
            Ingresa tu correo y te enviaremos un código de verificación.
          </p>
          <form onSubmit={handleEnviarCorreo}>
            <div className="username">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span></span>
              <label>Correo electrónico</label>
            </div>

            {error && <p style={estiloError}>{error}</p>}

            <div className="iniciarSesion">
              <button type="submit" className="btn">
                Enviar código
              </button>
            </div>

            <div className="olvideContraseña">
              <button
                type="button"
                className="linkBtn"
                onClick={() => navigate("/login")}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </form>
        </>
      )}

      {/* ── Paso 2: Código de verificación ── */}
      {paso === 2 && (
        <>
          <h1>Código de verificación</h1>
          <p style={{ textAlign: "center", marginBottom: "1rem", color: "#555", fontSize: "0.9rem" }}>
            Enviamos un código a <strong>{email}</strong>. Ingrésalo a continuación.
          </p>
          <form onSubmit={handleVerificarCodigo}>
            <div className="username">
              <input
                type="text"
                maxLength={6}
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                style={{ letterSpacing: "0.3rem", textAlign: "center" }}
              />
              <span></span>
              <label>Código de 6 dígitos</label>
            </div>

            {error && <p style={estiloError}>{error}</p>}

            <div className="iniciarSesion">
              <button type="submit" className="btn">
                Verificar código
              </button>
            </div>

            <div className="olvideContraseña">
              <button
                type="button"
                className="linkBtn"
                onClick={() => { setError(""); setPaso(1); }}
              >
                ← Cambiar correo
              </button>
            </div>
          </form>
        </>
      )}

      {/* ── Paso 3: Nueva contraseña ── */}
      {paso === 3 && (
        <>
          <h1>Nueva contraseña</h1>
          <p style={{ textAlign: "center", marginBottom: "1rem", color: "#555", fontSize: "0.9rem" }}>
            Crea una nueva contraseña segura.
          </p>
          <form onSubmit={handleNuevaContrasena}>
            <div className="username">
              <input
                type="password"
                required
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
              />
              <span></span>
              <label>Nueva contraseña</label>
            </div>

            <div className="username">
              <input
                type="password"
                required
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
              />
              <span></span>
              <label>Confirmar contraseña</label>
            </div>

            {error && <p style={estiloError}>{error}</p>}

            <div className="iniciarSesion">
              <button type="submit" className="btn">
                Guardar contraseña
              </button>
            </div>
          </form>
        </>
      )}

      {/* ── Paso 4: Éxito ── */}
      {paso === 4 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h1>¡Contraseña actualizada!</h1>
          <p style={{ color: "#555", margin: "1rem 0" }}>
            Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión.
          </p>
          <div className="iniciarSesion">
            <button
              className="btn"
              onClick={() => navigate("/login")}
            >
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const estiloError = {
  color: "red",
  fontSize: "0.85rem",
  textAlign: "center",
  margin: "0.5rem 0",
};

export default OlvideContrasena;
