import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import logo from "../assets/logo.png";

function RecuperarPassword() {
  const { fetchDataBackend, loading } = useFetch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const recuperar = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/reset`;
    const response = await fetchDataBackend(url, dataForm, "POST");
    if (response) {
      reset(); // Limpia el campo si la solicitud fue exitosa
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6f9] flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-[#00b1c1] bg-white shadow-md">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#bd3869]">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            No te preocupes, te enviaremos un enlace a tu correo
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-sm">
          <form
            onSubmit={handleSubmit(recuperar)}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="text-sm text-[#00b1c1] mb-1 block font-medium">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Ingresa un correo electrónico válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              disabled={loading}
              className="w-full bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition mt-2 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#00b1c1] hover:underline"
          >
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;
