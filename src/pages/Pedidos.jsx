import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import storeAuth from "../context/storeAuth";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const { fetchDataBackend, loading } = useFetch();
  const { token } = storeAuth();

  useEffect(() => {
    const obtenerMisPedidos = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/compras/pedidos/mis-pedidos`;
      const data = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`,
      });

      console.log("Mis pedidos:", data);
      if (data) {
        setPedidos(data);
      }
    };

    if (token) {
      obtenerMisPedidos();
    }
  }, [token]);

  const getEstadoEstilo = (estado) => {
    switch (estado?.toLowerCase()) {
      case "entregado":
      case "completado":
        return "bg-green-100 text-green-700 border-green-200";
      case "enviado":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pendiente":
      case "procesando":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelado":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#bd3869]">Mis Pedidos</h1>
        <p className="text-sm text-gray-500">
          Historial y estado de tus compras
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf6f9] border-b border-pink-100 text-gray-600 text-sm font-semibold">
                <th className="p-4">ID Pedido</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading && pedidos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
                    Cargando tus pedidos...
                  </td>
                </tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
                    Aún no has realizado ninguna compra.
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr
                    key={pedido._id}
                    className="hover:bg-pink-50/30 transition"
                  >
                    <td className="p-4 font-mono font-bold text-gray-900 text-xs">
                      #{pedido._id ? pedido._id.slice(-6).toUpperCase() : "N/A"}
                    </td>
                    <td className="p-4 text-gray-500">
                      {pedido.createdAt
                        ? new Date(pedido.createdAt).toLocaleDateString("es-EC")
                        : "N/A"}
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      ${Number(pedido.montoTotal || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoEstilo(pedido.estado)}`}
                      >
                        {pedido.estado || "Pendiente"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Pedidos;
