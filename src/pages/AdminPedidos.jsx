import { useState, useEffect } from "react";
import storeAuth from "../context/storeAuth";

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

const colores = {
  Pendiente: "bg-yellow-50 text-yellow-500",
  Pagado: "bg-blue-50 text-blue-500",
  Enviado: "bg-purple-50 text-purple-400",
  Entregado: "bg-[#e8f7f9] text-[#00b1c1]",
  Cancelado: "bg-red-50 text-red-400",
};

const ESTADOS = ["Pendiente", "Pagado", "Enviado", "Entregado", "Cancelado"];

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "—";
  return new Date(fechaISO).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatearMoneda = (monto) => `$${Number(monto || 0).toFixed(2)}`;

function AdminPedidos() {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  const { token } = storeAuth();

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(`${URL_BACKEND}/compras/admin/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.msg || "No se pudieron cargar los pedidos");
      }

      setLista(data);
    } catch (err) {
      console.error("ERROR AL OBTENER PEDIDOS:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    const estadoAnterior = lista.find((p) => p._id === id)?.estado;

    setLista((prev) =>
      prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p)),
    );
    setActualizandoId(id);

    try {
      const respuesta = await fetch(
        `${URL_BACKEND}/compras/admin/pedidos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        },
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          data.msg || "No se pudo actualizar el estado del pedido",
        );
      }
    } catch (err) {
      console.error("ERROR AL ACTUALIZAR ESTADO:", err);
      setLista((prev) =>
        prev.map((p) => (p._id === id ? { ...p, estado: estadoAnterior } : p)),
      );
      alert(err.message);
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Pedidos</h1>
      <p className="text-sm text-gray-400 mb-6">
        Gestiona todos los pedidos de tus clientes
      </p>

      {cargando && <p className="text-sm text-gray-400">Cargando pedidos...</p>}

      {!cargando && error && (
        <div className="bg-red-50 text-red-500 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={obtenerPedidos} className="underline font-semibold">
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && lista.length === 0 && (
        <p className="text-sm text-gray-400">
          Todavía no hay pedidos registrados
        </p>
      )}

      {!cargando && !error && lista.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#fdf6f9]">
              <tr>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p._id} className="border-t border-pink-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    #{p._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {p.usuario
                      ? `${p.usuario.nombre} ${p.usuario.apellido || ""}`.trim()
                      : "Usuario eliminado"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatearFecha(p.createdAt)}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#bd3869]">
                    {formatearMoneda(p.montoTotal)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${colores[p.estado] || "bg-gray-50 text-gray-500"}`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={p.estado}
                      disabled={actualizandoId === p._id}
                      onChange={(e) => cambiarEstado(p._id, e.target.value)}
                      className="border border-pink-100 rounded-xl px-3 py-1 text-xs text-gray-600 outline-none focus:border-[#00b1c1] disabled:opacity-50"
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;
