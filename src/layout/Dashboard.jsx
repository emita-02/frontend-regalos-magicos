import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import logo from "../assets/logo.png";

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const location = useLocation();
  const urlActual = location.pathname;
  const { token, clearToken, setRol } = storeAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

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
        setUsuario(data);
      }
    } catch (error) {
      console.error("ERROR AL OBTENER PERFIL:", error);
    }
  };

  const handleSalir = () => {
    clearToken();
    setRol(null);
    navigate("/");
  };

  const iniciales = usuario
    ? `${usuario.nombre?.[0] || ""}${usuario.apellido?.[0] || ""}`.toUpperCase()
    : null;

  const linkEsActivo = (to) => urlActual.startsWith(to);

  return (
    <div className="md:flex md:min-h-screen">
      {/* Sidebar / Menú Lateral */}
      <div className="md:w-1/5 bg-white border-r border-pink-100 px-5 py-6 flex flex-col justify-between">
        <div>
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

            <p className="text-xs text-gray-400">Panel de cliente</p>
          </div>

          <hr className="border-pink-100 mb-4" />

          <ul className="flex flex-col gap-2">
            {[
              { to: "/dashboard/cliente/perfil", label: "Mi perfil" },
              { to: "/dashboard/cliente/favoritos", label: "Favoritos" },
              { to: "/dashboard/cliente/pedidos", label: "Pedidos" },
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
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col bg-[#fdf6f9]">
        <div className="bg-white border-b border-pink-100 py-3 px-8 flex justify-end items-center gap-4">
          {usuario && (
            <span className="text-sm text-gray-500 hidden md:inline">
              {usuario.nombre} {usuario.apellido || ""}
            </span>
          )}
          <div className="w-9 h-9 rounded-full bg-[#fce8f3] flex items-center justify-center text-sm font-bold text-[#bd3869]">
            {iniciales || "👤"}
          </div>
          <button
            onClick={handleSalir}
            className="w-18 bg-[#fce8f3] text-[#bd3869] py-2 rounded-xl text-sm font-semibold hover:bg-[#bd3869] hover:text-white transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="overflow-y-auto p-8 flex-1">
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

export default Dashboard;
