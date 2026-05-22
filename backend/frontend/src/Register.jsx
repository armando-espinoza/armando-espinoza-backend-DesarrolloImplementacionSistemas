import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./componentes/login.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    alert("Cuenta creada (simulado)");

    navigate("/login"); // regresa al login
  };

  return (
    <div className="formulario">
      <h1>Crear Cuenta</h1>

      <form onSubmit={handleSubmit}>
        <div className="username">
          <input type="text" name="username" required onChange={handleChange} />
          <span></span>
          <label>Usuario</label>
        </div>

        <div className="username">
          <input type="email" name="email" required onChange={handleChange} />
          <span></span>
          <label>Correo</label>
        </div>

        <div className="username">
          <input type="password" name="password" required onChange={handleChange} />
          <span></span>
          <label>Contraseña</label>
        </div>

        <div className="iniciarSesion">
          <button type="submit" className="btn">
            Registrarse
          </button>
        </div>

        <div className="registro">
          ¿Ya tienes cuenta?{" "}
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;