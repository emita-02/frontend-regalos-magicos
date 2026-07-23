import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useFetch } from "../hooks/useFetch";
import storeAuth from "../context/storeAuth";
import fondo_login from "../assets/fondo_login.png";

function Login() {
  const [esLogin, setEsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { fetchDataBackend, loading } = useFetch();
  const { setToken, setRol } = storeAuth();
  const navigate = useNavigate();

  const loginForm = useForm({ mode: "onSubmit" });
  const registerForm = useForm({ mode: "onSubmit" });

  const loginUser = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/login`;
    const response = await fetchDataBackend(url, dataForm, "POST");
    if (response) {
      setToken(response.token);
      setRol(response.rol);
      if (response.rol === "Admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/cliente");
      }
    }
  };

  // --- Autenticación con Google ---
  const googleLoginUser = async (credentialResponse) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/google`;
    const dataToSend = { credential: credentialResponse.credential };

    const response = await fetchDataBackend(url, dataToSend, "POST");
    if (response) {
      setToken(response.token);
      setRol(response.rol);
      if (response.rol === "Admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/cliente");
      }
    }
  };

  const registerUser = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/registro`;
    const response = await fetchDataBackend(url, dataForm, "POST");
    if (response) {
      registerForm.reset();
      setEsLogin(true); // Vuelve a la vista de login para que confirme su correo e ingrese
    }
  };

  const cambiarVista = () => {
    loginForm.reset();
    registerForm.reset();
    setEsLogin(!esLogin);
  };

  return (
    <div className="min-h-screen bg-[#fdf6f9] flex items-center justify-center px-6 py-10">
      <ToastContainer />
      <div className="relative w-full max-w-6xl h-[720px] bg-white rounded-[40px] shadow-2xl overflow-hidden">
        {/* Inicio de sesión */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 z-20 ${esLogin ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          <div className="relative w-[80%] max-h-full overflow-y-auto pt-16 pb-16">
            <Link
              to="/"
              className="absolute top-0 left-2 flex items-center gap-1 text-[#bd3869] text-sm font-semibold hover:opacity-75 transition"
            >
              ← Volver a la página principal
            </Link>
            <h2 className="text-4xl font-bold text-[#bd3869] mb-6 text-center">
              Iniciar sesión
            </h2>

            <form
              onSubmit={loginForm.handleSubmit(loginUser)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-2xl border border-pink-100 px-5 py-3 outline-none focus:border-[#00b1c1] transition"
                  {...loginForm.register("email", {
                    required: "El correo es obligatorio",
                  })}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-pink-100 px-5 py-3 pr-12 outline-none focus:border-[#00b1c1] transition"
                    {...loginForm.register("password", {
                      required: "La contraseña es obligatoria",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-[#bd3869]"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-xs mt-2">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  to="/recuperar-password"
                  className="text-sm text-[#00b1c1] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                disabled={loading}
                className="mt-1 w-full rounded-2xl bg-[#bd3869] text-white py-3 font-semibold hover:scale-[1.02] transition duration-300 disabled:opacity-60"
              >
                {loading ? "Iniciando..." : "Iniciar sesión"}
              </button>
            </form>

            {/* Separador UI */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">
                O
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Botón Google OAuth */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={googleLoginUser}
                onError={() =>
                  console.error("Error al iniciar sesión con Google")
                }
                shape="pill"
                theme="outline"
              />
            </div>
          </div>
        </div>

        {/* Registro */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 z-20 ${esLogin ? "-translate-x-full opacity-0" : "translate-x-full opacity-100"}`}
        >
          <div className="w-[80%] max-h-full overflow-y-auto py-8">
            <h2 className="text-4xl font-bold text-[#bd3869] mb-8 text-center">
              Crear cuenta
            </h2>
            <form
              onSubmit={registerForm.handleSubmit(registerUser)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border border-pink-100 px-5 py-3 outline-none focus:border-[#00b1c1] transition"
                  {...registerForm.register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {registerForm.formState.errors.nombre && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.nombre.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Tu apellido"
                  className="w-full rounded-2xl border border-pink-100 px-5 py-3 outline-none focus:border-[#00b1c1] transition"
                  {...registerForm.register("apellido", {
                    required: "El apellido es obligatorio",
                  })}
                />
                {registerForm.formState.errors.apellido && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.apellido.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  placeholder="Tu teléfono"
                  className="w-full rounded-2xl border border-pink-100 px-5 py-3 outline-none focus:border-[#00b1c1] transition"
                  {...registerForm.register("telefono", {
                    required: "El teléfono es obligatorio",
                  })}
                />
                {registerForm.formState.errors.telefono && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.telefono.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Tu dirección"
                  className="w-full rounded-2xl border border-pink-100 px-5 py-3 outline-none focus:border-[#00b1c1] transition"
                  {...registerForm.register("direccion", {
                    required: "La dirección es obligatoria",
                  })}
                />
                {registerForm.formState.errors.direccion && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.direccion.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-2xl border border-pink-100 px-5 py-3 outline-none focus:border-[#00b1c1] transition"
                  {...registerForm.register("email", {
                    required: "El correo es obligatorio",
                  })}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[#00b1c1] block mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-pink-100 px-5 py-3 pr-12 outline-none focus:border-[#00b1c1] transition"
                    {...registerForm.register("password", {
                      required: "La contraseña es obligatoria",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-[#bd3869]"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-xs mt-2">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <button
                disabled={loading}
                className="mt-3 w-full rounded-2xl bg-[#bd3869] text-white py-3 font-semibold hover:scale-[1.02] transition duration-300 disabled:opacity-60"
              >
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>
          </div>
        </div>

        {/* Panel derecho */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full transition-all duration-700 z-30 ${esLogin ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={fondo_login}
              alt="regalo"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-10 text-white">
              <h2 className="text-4xl font-bold mb-6">
                {esLogin ? "Bienvenido de nuevo" : "Únete a nosotros"}
              </h2>
              <p className="text-lg leading-8">
                {esLogin
                  ? "Ingresa para descubrir desayunos sorpresa y regalos personalizados."
                  : "Crea una cuenta y comienza a sorprender a las personas que más quieres."}
              </p>
              <button
                type="button"
                onClick={cambiarVista}
                className="mt-12 border-2 border-[#f3ebef] rounded-full px-10 py-3 font-semibold hover:bg-white hover:text-[#bd3869] transition duration-300"
              >
                {esLogin ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
