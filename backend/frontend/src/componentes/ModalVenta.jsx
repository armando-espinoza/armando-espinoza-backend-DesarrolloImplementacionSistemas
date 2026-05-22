import { useState } from "react";
import "./ModalVenta.css";

const PLATILLOS = [
  { id: 1, nombre: "Salmón Nigiri",   precio: 180 },
  { id: 2, nombre: "Dragon Roll",     precio: 210 },
  { id: 3, nombre: "Aguacate Maki",   precio: 140 },
  { id: 4, nombre: "Ebi Tempura",     precio: 195 },
  { id: 5, nombre: "Ramen Tonkotsu",  precio: 165 },
  { id: 6, nombre: "Toro Nigiri",     precio: 220 },
  { id: 7, nombre: "Mochi Ice Cream", precio: 95  },
  { id: 8, nombre: "Omakase Set",     precio: 450 },
];

const MESAS    = Array.from({ length: 16 }, (_, i) => `Mesa ${i + 1}`);
const MESEROS  = ["Yuki Ramírez", "Sofía Mendoza", "Luis Torres", "Ana Castillo"];
const METODOS  = ["Efectivo", "Tarjeta de crédito", "Tarjeta de débito", "Transferencia"];

const itemVacio = () => ({ platillo: "", cantidad: 1, precio: 0 });

export default function ModalVenta({ onClose, onGuardar }) {
  const hoy = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    fecha:   hoy,
    mesa:    "",
    mesero:  "",
    metodo:  "",
    items:   [itemVacio()],
    notas:   "",
  });

  const [guardado, setGuardado] = useState(false);
  const [errores,  setErrores]  = useState({});

  // ── ITEMS ──────────────────────────────────────────
  const setItem = (idx, campo, valor) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [campo]: valor };

    if (campo === "platillo") {
      const p = PLATILLOS.find(p => p.nombre === valor);
      items[idx].precio = p ? p.precio : 0;
    }
    setForm(f => ({ ...f, items }));
  };

  const agregarItem = () =>
    setForm(f => ({ ...f, items: [...f.items, itemVacio()] }));

  const quitarItem = (idx) =>
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  // ── CÁLCULOS ───────────────────────────────────────
  const subtotal = form.items.reduce(
    (acc, it) => acc + (Number(it.precio) * Number(it.cantidad)), 0
  );
  const iva      = subtotal * 0.16;
  const total    = subtotal + iva;

  // ── VALIDACIÓN ─────────────────────────────────────
  const validar = () => {
    const e = {};
    if (!form.mesa)   e.mesa   = "Selecciona una mesa";
    if (!form.mesero) e.mesero = "Selecciona un mesero";
    if (!form.metodo) e.metodo = "Selecciona método de pago";
    form.items.forEach((it, i) => {
      if (!it.platillo) e[`item_${i}`] = "Selecciona un platillo";
    });
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // ── GUARDAR ────────────────────────────────────────
  const handleGuardar = () => {
    if (!validar()) return;
const venta = { ...form, subtotal, iva, total };    onGuardar?.(venta);
    setGuardado(true);
    setTimeout(() => { onClose?.(); }, 1800);
  };

  // ── RENDER ─────────────────────────────────────────
  return (
    <div className="mv-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="mv-modal">

        {/* HEADER */}
        <div className="mv-header">
          <div>
            <div className="mv-title">Registrar Venta</div>
            <div className="mv-sub">売上登録 · Completa los datos de la orden</div>
          </div>
          <button className="mv-close" onClick={onClose}>✕</button>
        </div>

        {/* ÉXITO */}
        {guardado && (
          <div className="mv-success">
            <span className="mv-success-ic">✓</span>
            Venta registrada correctamente
          </div>
        )}

        <div className="mv-body">

          {/* FILA 1: Fecha + Mesa */}
          <div className="mv-row2">
            <div className="mv-field">
              <label className="mv-label">Fecha y Hora</label>
              <input
                className="mv-input"
                type="datetime-local"
                value={form.fecha}
                onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
              />
            </div>
            <div className="mv-field">
              <label className="mv-label">Mesa</label>
              <select
                className={`mv-input${errores.mesa ? " mv-error-input" : ""}`}
                value={form.mesa}
                onChange={e => setForm(f => ({ ...f, mesa: e.target.value }))}
              >
                <option value="">Seleccionar mesa…</option>
                {MESAS.map(m => <option key={m}>{m}</option>)}
              </select>
              {errores.mesa && <span className="mv-error">{errores.mesa}</span>}
            </div>
          </div>

          {/* FILA 2: Mesero + Método */}
          <div className="mv-row2">
            <div className="mv-field">
              <label className="mv-label">Mesero</label>
              <select
                className={`mv-input${errores.mesero ? " mv-error-input" : ""}`}
                value={form.mesero}
                onChange={e => setForm(f => ({ ...f, mesero: e.target.value }))}
              >
                <option value="">Seleccionar mesero…</option>
                {MESEROS.map(m => <option key={m}>{m}</option>)}
              </select>
              {errores.mesero && <span className="mv-error">{errores.mesero}</span>}
            </div>
            <div className="mv-field">
              <label className="mv-label">Método de Pago</label>
              <select
                className={`mv-input${errores.metodo ? " mv-error-input" : ""}`}
                value={form.metodo}
                onChange={e => setForm(f => ({ ...f, metodo: e.target.value }))}
              >
                <option value="">Seleccionar método…</option>
                {METODOS.map(m => <option key={m}>{m}</option>)}
              </select>
              {errores.metodo && <span className="mv-error">{errores.metodo}</span>}
            </div>
          </div>

          {/* PLATILLOS */}
          <div className="mv-section-label">
            Platillos <span className="mv-badge">{form.items.length}</span>
          </div>

          <div className="mv-items-wrap">
            {form.items.map((it, idx) => (
              <div className="mv-item-row" key={idx}>
                <div className="mv-item-num">{idx + 1}</div>

                <div className="mv-field mv-field-grow">
                  <select
                    className={`mv-input${errores[`item_${idx}`] ? " mv-error-input" : ""}`}
                    value={it.platillo}
                    onChange={e => setItem(idx, "platillo", e.target.value)}
                  >
                    <option value="">Seleccionar platillo…</option>
                    {PLATILLOS.map(p => (
                      <option key={p.id} value={p.nombre}>{p.nombre}</option>
                    ))}
                  </select>
                  {errores[`item_${idx}`] && (
                    <span className="mv-error">{errores[`item_${idx}`]}</span>
                  )}
                </div>

                <div className="mv-field mv-field-qty">
                  <input
                    className="mv-input mv-input-center"
                    type="number"
                    min="1"
                    value={it.cantidad}
                    onChange={e => setItem(idx, "cantidad", e.target.value)}
                  />
                </div>

                <div className="mv-field mv-field-price">
                  <div className="mv-price-prefix">$</div>
                  <input
                    className="mv-input mv-input-price"
                    type="number"
                    min="0"
                    value={it.precio}
                    onChange={e => setItem(idx, "precio", e.target.value)}
                  />
                </div>

                <div className="mv-item-subtotal">
                  ${(it.precio * it.cantidad).toLocaleString()}
                </div>

                {form.items.length > 1 && (
                  <button className="mv-del-item" onClick={() => quitarItem(idx)}>✕</button>
                )}
              </div>
            ))}
          </div>

          <button className="mv-add-item" onClick={agregarItem}>
            ＋ Agregar platillo
          </button>

          {/* NOTAS */}
          <div className="mv-field" style={{ marginTop: "16px" }}>
            <label className="mv-label">Notas (opcional)</label>
            <textarea
              className="mv-input mv-textarea"
              placeholder="Alergias, preferencias, indicaciones especiales…"
              value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
            />
          </div>

          {/* TOTALES */}
          <div className="mv-totales">
            <div className="mv-total-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mv-total-row">
              <span>IVA (16%)</span>
              <span>${iva.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mv-total-row mv-total-final">
              <span>Total</span>
              <span>${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mv-footer">
          <button className="mv-btn mv-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="mv-btn mv-btn-save" onClick={handleGuardar}>
            ✓ Registrar Venta
          </button>
        </div>

      </div>
    </div>
  );
}
