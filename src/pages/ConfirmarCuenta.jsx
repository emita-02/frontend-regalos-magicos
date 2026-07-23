import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useFetch } from "../hooks/useFetch";

function ConfirmarCuenta() {
  const { fetchDataBackend, loading } = useFetch();
  const { token } = useParams();
  const [confirmado, setConfirmado] = useState(null); // null = verificando, true/false = resultado

  const verifyToken = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/confirmar/${token}`;
    const response = await fetchDataBackend(url);
    setConfirmado(!!response);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf6f9] flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl border border-pink-100 p-10 shadow-sm">
          {loading || confirmado === null ? (
            <>
              <div className="w-20 h-20 bg-[#fce8f3] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ⏳
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Verificando...
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Estamos confirmando tu cuenta, un momento.
              </p>
            </>
          ) : confirmado ? (
            <>
              <div className="w-20 h-20 bg-[#fce8f3] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🎁
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                ¡Muchas gracias!
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar
                sesión.
              </p>
              <Link to="/login">
                <button className="w-full bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                  Iniciar sesión
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-[#fce8f3] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ⚠️
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                No pudimos confirmar tu cuenta
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                El enlace es inválido o ya fue utilizado. Intenta registrarte
                nuevamente o inicia sesión si ya confirmaste antes.
              </p>
              <Link to="/login">
                <button className="w-full bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                  Ir a iniciar sesión
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmarCuenta;
