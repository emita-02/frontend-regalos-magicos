import { useState, useEffect } from "react";
import storeAuth from "../context/storeAuth";

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { token } = storeAuth();

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(
        `${URL_BACKEND}/usuarios/admin/usuarios?rol=Cliente`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.msg || "No se pudieron cargar los clientes");
      }

      setClientes(data);
    } catch (err) {
      console.error("ERROR AL OBTENER CLIENTES:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Clientes</h1>
      <p className="text-sm text-gray-400 mb-6">
        Lista de clientes registrados
      </p>

      {cargando && (
        <p className="text-sm text-gray-400">Cargando clientes...</p>
      )}

      {!cargando && error && (
        <div className="bg-red-50 text-red-500 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={obtenerClientes} className="underline font-semibold">
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && clientes.length === 0 && (
        <p className="text-sm text-gray-400">
          Todavía no hay clientes registrados
        </p>
      )}

      {!cargando && !error && clientes.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#fdf6f9]">
              <tr>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Correo
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c._id} className="border-t border-pink-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {`${c.nombre} ${c.apellido || ""}`.trim()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {c.telefono || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status ? "bg-[#e8f7f9] text-[#00b1c1]" : "bg-red-50 text-red-400"}`}
                    >
                      {c.status ? "Activo" : "Inactivo"}
                    </span>
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

export default AdminClientes;
