import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { useFetch } from "../hooks/useFetch";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { fetchDataBackend, loading } = useFetch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);

  // Observa el campo 'password' para validar la coincidencia en tiempo real
  const password = watch("password");

  useEffect(() => {
    const verifyToken = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/reset/${token}`;
      const response = await fetchDataBackend(url, null, "GET");
      if (response) {
        setTokenValido(true);
      }
    };
    verifyToken();
  }, [token]);

  const changePassword = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/nuevopassword/${token}`;
    const response = await fetchDataBackend(
      url,
      { password: dataForm.password },
      "POST",
    );

    if (response) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6f9] flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 border-2 border-[#00b1c1] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 bg-white">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-gray-700">Nueva contraseña</h1>
          <p className="text-gray-400 text-sm mt-1">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-sm">
          {tokenValido ? (
            <form
              onSubmit={handleSubmit(changePassword)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition pr-10"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Debe tener al menos 6 caracteres",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#bd3869]"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={18} />
                    ) : (
                      <MdVisibility size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition"
                  {...register("confirmpassword", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                />
                {errors.confirmpassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmpassword.message}
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition mt-2 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">Verificando token...</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-xs text-[#00b1c1] hover:underline">
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
