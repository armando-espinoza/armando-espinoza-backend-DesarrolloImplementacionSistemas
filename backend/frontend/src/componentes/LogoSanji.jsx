import React from 'react';
import './LogoSanji.css'; // Asegúrate de crear este archivo CSS también

/**
 * Isotipo Sanji (solo el círculo con el salmón)
 * @param {string} size - Tamaño cuadrado (ej: "40px", "100px")
 */
export const IsotipoSanji = ({ size = "40px" }) => {
  return (
    <div 
      className="sanji-isotipo" 
      style={{ '--sanji-size': size }}
    >
      <div className="sanji-circulo-blanco">
        {/* Usamos el gráfico de salmón codificado como SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="sanji-grafico-salmon"
        >
          <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" opacity=".2"/>
          <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30zm24.6 30C72 61.5 61.5 72 50 72s-22-10.5-24.6-22c1-11.2 11.2-19 23-19h3.2c11.8 0 22 7.8 23 19z" className="salmon-fill"/>
        </svg>
      </div>
    </div>
  );
};

/**
 * Logotipo Completo Sanji (Isotipo + Texto)
 * @param {string} mode - "full" para ambos, "isotipo" para solo el gráfico
 * @param {string} size - Tamaño del isotipo
 */
const LogoSanji = ({ mode = "full", size = "48px" }) => {
  return (
    <div className={`sanji-logo-container sanji-mode-${mode}`}>
      <IsotipoSanji size={size} />
      
      {mode === "full" && (
        <div className="sanji-text-group">
          <h1 className="sanji-brand-name">
            S A N J I <span className="brand-suffix">ROLL</span>
          </h1>
          <p className="sanji-brand-sub">売上管理</p>
        </div>
      )}
    </div>
  );
};

export default LogoSanji;