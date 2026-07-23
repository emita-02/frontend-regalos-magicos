import { useState, useEffect } from "react";
import storeAuth from "../context/storeAuth";

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

function AdminDashboard() {
  const [stats, setStats] = useState({
    pedidosTotales: null,
    productos: null,
    pendientes: null,
    clientes: null,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { token } = storeAuth();

  useEffect(() => {
    obtenerEstadisticas();
  }, []);

  const obtenerEstadisticas = async () => {
    try {
      setCargando(true);
      setError(null);

      const [respPedidos, respProductos, respClientes] = await Promise.all([
        fetch(`${URL_BACKEND}/compras/admin/pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${URL_BACKEND}/tienda/productos`),
        fetch(`${URL_BACKEND}/usuarios/admin/usuarios?rol=Cliente`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const pedidos = await respPedidos.json();
      const productos = await respProductos.json();
      const clientes = await respClientes.json();

      if (!respPedidos.ok)
        throw new Error(pedidos.msg || "No se pudieron cargar los pedidos");
      if (!respProductos.ok)
        throw new Error(productos.msg || "No se pudieron cargar los productos");
      if (!respClientes.ok)
        throw new Error(clientes.msg || "No se pudieron cargar los clientes");

      const pendientes = pedidos.filter((p) => p.estado === "Pendiente").length;

      setStats({
        pedidosTotales: pedidos.length,
        productos: productos.length,
        pendientes,
        clientes: clientes.length,
      });
    } catch (err) {
      console.error("ERROR AL OBTENER ESTADÍSTICAS:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const tarjetas = [
    {
      label: "Pedidos totales",
      valor: stats.pedidosTotales,
      color: "bg-[#fce8f3]",
      texto: "text-[#bd3869]",
    },
    {
      label: "Productos",
      valor: stats.productos,
      color: "bg-[#e8f7f9]",
      texto: "text-[#00b1c1]",
    },
    {
      label: "Clientes",
      valor: stats.clientes,
      color: "bg-[#fdf6f9]",
      texto: "text-[#bd3869]",
    },
    {
      label: "Pendientes",
      valor: stats.pendientes,
      color: "bg-yellow-50",
      texto: "text-yellow-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-500 rounded-xl px-4 py-3 text-sm mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={obtenerEstadisticas}
            className="underline font-semibold"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tarjetas.map((item, i) => (
          <div key={i} className={`${item.color} rounded-2xl p-6`}>
            <p className={`text-3xl font-bold ${item.texto}`}>
              {cargando ? "..." : (item.valor ?? "—")}
            </p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
