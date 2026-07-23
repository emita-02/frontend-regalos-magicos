
import { useState, useEffect, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import storeAuth from '../context/storeAuth'

function Perfil() {
  const { fetchDataBackend, loading } = useFetch()
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm()
  const [editando, setEditando] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()
  const { token } = storeAuth()
 

  useEffect(() => {
    const getPerfil = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/perfil`
      const data = await fetchDataBackend(url, null, 'GET', { Authorization: `Bearer ${token}` })
      if (data) {
        console.log(data)
        setUsuario(data)
        setValue('nombre', data.nombre)
        setValue('apellido', data.apellido)
        setValue('telefono', data.telefono)
        setValue('direccion', data.direccion)
        setValue('email', data.email)
      }
    }
    getPerfil()
  }, [])

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const cancelar = () => {
    if (usuario) {
      reset({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        email: usuario.email
      })
    }
    setFoto(null)
    setPreview(null)
    setEditando(false)
  }

  const guardar = async (dataForm) => {
    console.log("SE EJECUTÓ GUARDAR")
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/perfil`

    const respuesta = await fetchDataBackend(
        url,
        dataForm,
        "PUT",
        {
            Authorization: `Bearer ${token}`
        }
    )

    if (respuesta?.usuario) {
      setUsuario(respuesta.usuario)
      reset({
        nombre: respuesta.usuario.nombre,
        apellido: respuesta.usuario.apellido,
        telefono: respuesta.usuario.telefono,
        direccion: respuesta.usuario.direccion,
        email: respuesta.usuario.email
      })
      setEditando(false)
    }
}

  return (
    <div className="min-h-screen bg-[#fdf6f9] px-6 py-10">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-sm mb-6">
          <div className="flex flex-col items-center mb-8">

            <div
              className="w-24 h-24 rounded-full bg-[#fce8f3] flex items-center justify-center mb-4 border-2 border-[#f8cdeb] overflow-hidden cursor-pointer relative"
              onClick={() => editando && fileRef.current.click()}
            >
              {preview ? (
                <img src={preview} alt="foto" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
              {editando && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full">
                  <span className="text-white text-xs font-semibold">Cambiar</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFoto}
              className="hidden"
            />

            <h2 className="text-xl font-bold text-gray-700">
              {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...'}
            </h2>
            <p className="text-sm text-gray-400">{usuario?.email}</p>
          </div>

          <form onSubmit={handleSubmit(guardar)} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre</label>
              <input
                type="text"
                disabled={!editando}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition ${editando ? 'border-[#00b1c1] bg-white' : 'border-pink-100 bg-[#fdf6f9]'}`}
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Apellido</label>
              <input
                type="text"
                disabled={!editando}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition ${editando ? 'border-[#00b1c1] bg-white' : 'border-pink-100 bg-[#fdf6f9]'}`}
                {...register("apellido", { required: "El apellido es obligatorio" })}
              />
              {errors.apellido && <p className="text-red-400 text-xs mt-1">{errors.apellido.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Correo electrónico</label>
              <input
                type="email"
                disabled={!editando}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition ${editando ? 'border-[#00b1c1] bg-white' : 'border-pink-100 bg-[#fdf6f9]'}`}
                {...register("email")}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Teléfono</label>
              <input
                type="text"
                disabled={!editando}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition ${editando ? 'border-[#00b1c1] bg-white' : 'border-pink-100 bg-[#fdf6f9]'}`}
                {...register("telefono", { required: "El teléfono es obligatorio" })}
              />
              {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Dirección</label>
              <input
                type="text"
                disabled={!editando}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition ${editando ? 'border-[#00b1c1] bg-white' : 'border-pink-100 bg-[#fdf6f9]'}`}
                {...register("direccion", { required: "La dirección es obligatoria" })}
              />
              {errors.direccion && <p className="text-red-400 text-xs mt-1">{errors.direccion.message}</p>}
            </div>
          </form>

          {/*
            Los botones viven FUERA del <form>.
            Motivo: cuando "Editar perfil" (type="button") es reemplazado en el mismo
            lugar por "Guardar cambios" (type="submit") dentro de un <form>, algunos
            navegadores procesan ese mismo clic como si tocara al nuevo botón y disparan
            un submit fantasma. Al sacarlos del <form>, eso es imposible.
          */}
          <div className="flex gap-3 mt-4">
            {editando ? (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit(guardar)}
                  className="flex-1 bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={cancelar}
                  className="flex-1 border border-pink-100 text-gray-400 py-3 rounded-xl text-sm font-semibold hover:bg-[#fdf6f9] transition"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditando(true)}
                className="flex-1 border border-[#00b1c1] text-[#00b1c1] py-3 rounded-xl text-sm font-semibold hover:bg-[#f0fafb] transition"
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>

       

      </div>
    </div>
  )
}

export default Perfil
