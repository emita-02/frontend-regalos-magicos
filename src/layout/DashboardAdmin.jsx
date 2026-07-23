import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import logo from "../assets/logo.png";

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

const DashboardAdmin = () => {
  const location = useLocation();
  const urlActual = location.pathname;
  const { token, clearToken, setRol } = storeAuth();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const obtenerPerfil = async () => {
    try {
      const respuesta = await fetch(`${URL_BACKEND}/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        setAdmin(data);
      }
    } catch (error) {
      console.error("ERROR AL OBTENER PERFIL DEL ADMIN:", error);
    }
  };

  const handleSalir = () => {
    clearToken();
    setRol(null);
    navigate("/");
  };

  const iniciales = admin
    ? `${admin.nombre?.[0] || ""}${admin.apellido?.[0] || ""}`.toUpperCase()
    : "";

  const linkEsActivo = (to) => {
    // Match exacto para el dashboard raíz, y por prefijo para las subsecciones
    if (to === "/dashboard/admin") return urlActual === to;
    return urlActual.startsWith(to);
  };

  return (
    <div className="md:flex md:min-h-screen">
      <div className="md:w-1/5 bg-white border-r border-pink-100 px-5 py-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 object-contain mb-2"
          />
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h2 className="text-lg font-bold text-[#bd3869] text-center">
              Regalos Mágicos
            </h2>
          </Link>
          <p className="text-xs text-gray-400">Panel de administración</p>
        </div>

        <hr className="border-pink-100 mb-4" />

        <ul className="flex flex-col gap-2">
          {[
            { to: "/dashboard/admin", label: "Dashboard" },
            { to: "/dashboard/admin/pedidos", label: "Pedidos" },
            { to: "/dashboard/admin/productos", label: "Productos" },
            { to: "/dashboard/admin/clientes", label: "Clientes" },
            { to: "/dashboard/admin/perfil", label: "Mi perfil" },
          ].map((item, i) => (
            <li key={i}>
              <Link
                to={item.to}
                className={`block px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  linkEsActivo(item.to)
                    ? "bg-[#fce8f3] text-[#bd3869]"
                    : "text-gray-400 hover:text-[#bd3869] hover:bg-[#fdf6f9]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <button
            onClick={handleSalir}
            className="w-full bg-[#fce8f3] text-[#bd3869] py-2 rounded-xl text-sm font-semibold hover:bg-[#bd3869] hover:text-white transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#fdf6f9]">
        <div className="bg-white border-b border-pink-100 py-3 px-8 flex justify-between items-center">
          <p className="text-sm font-semibold text-[#bd3869]">
            Panel Administrador
          </p>
          <div className="flex items-center gap-2">
            {admin && (
              <span className="text-sm text-gray-500 hidden md:inline">
                {admin.nombre} {admin.apellido || ""}
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-[#fce8f3] flex items-center justify-center text-sm font-bold text-[#bd3869]">
              {iniciales || "👤"}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-8">
          <Outlet />
        </div>

        <div className="bg-white border-t border-pink-100 py-3">
          <p className="text-center text-xs text-gray-300">
            © 2026 Regalos Mágicos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;