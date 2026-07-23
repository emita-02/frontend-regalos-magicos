

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import storeCarrito from '../context/storeCarrito'
import storeAuth from '../context/storeAuth'
import { useFetch } from '../hooks/useFetch'

const OPCIONES_ENVOLTURA = ['Estándar', 'Premium', 'Ecológica']

function Carrito() {
  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    actualizarCantidad,
    eliminarCarrito,
    actualizarPersonalizacion
  } = storeCarrito()

  const { token } = storeAuth()
  const { fetchDataBackend, loading } = useFetch()
  const navigate = useNavigate()

  const [itemAbierto, setItemAbierto] = useState(null)
  const [direccionEnvio, setDireccionEnvio] = useState('')
  const [procesandoPago, setProcesandoPago] = useState(false)

  const urlCompras = import.meta.env.VITE_BACKEND_URL
  const urlUsuarios = import.meta.env.VITE_BACKEND_URL

  const total = carrito.reduce(
    (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
    0
  )

  const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  // Precargamos la dirección guardada en el perfil del cliente, si existe
  useEffect(() => {
    const cargarDireccion = async () => {
      if (!token) return
      const data = await fetchDataBackend(
        `${urlUsuarios}/usuarios/perfil`,
        null,
        'GET',
        { Authorization: `Bearer ${token}` }
      )
      if (data?.direccion) {
        setDireccionEnvio(data.direccion)
      }
    }
    cargarDireccion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const toggleItem = (id) => {
    setItemAbierto(itemAbierto === id ? null : id)
  }

  const handleCantidadInput = (id, valor) => {
    if (valor === '') return
    actualizarCantidad(id, valor)
  }

  const handlePagar = async () => {
    if (!token) {
      toast.error('Debes iniciar sesión para continuar con el pago')
      navigate('/login')
      return
    }

    if (carrito.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    if (!direccionEnvio.trim()) {
      toast.error('Ingresa una dirección de envío')
      return
    }

    setProcesandoPago(true)

    // 1. Creamos el pedido en el backend a partir del carrito
    const productos = carrito.map(item => ({
      producto: item._id || item.id,
      cantidad: item.cantidad
    }))

    const dataPedido = await fetchDataBackend(
      `${urlCompras}/compras/pedidos`,
      { productos, direccionEnvio },
      'POST',
      { Authorization: `Bearer ${token}` }
    )

    const idPedido = dataPedido?.nuevoPedido?._id

    if (!idPedido) {
      setProcesandoPago(false)
      return
    }

    // 2. Generamos la sesión de pago en Stripe Checkout
    const dataPago = await fetchDataBackend(
      `${urlCompras}/compras/pedidos/${idPedido}/pagar`,
      {},
      'POST',
      { Authorization: `Bearer ${token}` }
    ) 

    if (dataPago?.url) {
      window.location.assign(dataPago.url)
    }
    setProcesandoPago(false)
  }

  return (
    <div className="min-h-screen bg-[#fdf6f9] px-6 py-10 pt-28">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Mi <span className="text-[#bd3869]">Carrito</span>
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          {cantidadItems} {cantidadItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
        </p>

        {carrito.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-pink-100">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {carrito.map(item => {
                const id = item._id || item.id
                const imagen = item.imagenUrl || item.img
                const abierto = itemAbierto === id

                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl border border-pink-100 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={imagen}
                        alt={item.nombre}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-700 text-sm">{item.nombre}</p>
                        <p className="text-[#bd3869] font-bold mt-1">
                          ${Number(item.precio || 0).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => disminuirCantidad(id)}
                            className="w-7 h-7 rounded-full border border-pink-100 text-gray-400 flex items-center justify-center hover:border-[#bd3869] hover:text-[#bd3869] transition"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min={1}
                            value={item.cantidad}
                            onChange={(e) => handleCantidadInput(id, e.target.value)}
                            className="w-12 text-center text-sm font-semibold text-gray-700 border border-pink-100 rounded-lg outline-none focus:border-[#bd3869]"
                          />

                          <button
                            onClick={() => aumentarCantidad(id)}
                            className="w-7 h-7 rounded-full border border-pink-100 text-gray-400 flex items-center justify-center hover:border-[#bd3869] hover:text-[#bd3869] transition"
                          >
                            +
                          </button>

                          <button
                            onClick={() => toggleItem(id)}
                            className="ml-2 text-xs font-semibold text-[#00b1c1] hover:underline"
                          >
                            {abierto ? 'Ocultar personalización' : 'Personalizar'}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => eliminarCarrito(id)}
                        className="text-gray-300 hover:text-[#bd3869] transition text-lg self-start"
                      >
                        ✕
                      </button>
                    </div>

                    {abierto && (
                      <div className="mt-4 pt-4 border-t border-pink-50 flex flex-col gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500">
                            Mensaje para la tarjeta / regalo
                          </label>
                          <input
                            type="text"
                            maxLength={120}
                            value={item.personalizacion?.mensaje || ''}
                            onChange={(e) =>
                              actualizarPersonalizacion(id, { mensaje: e.target.value })
                            }
                            placeholder="Ej. ¡Feliz cumpleaños, Ana!"
                            className="w-full mt-1 border border-pink-100 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition"
                          />
                        </div>

                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500">
                              Envoltura
                            </label>
                            <select
                              value={item.personalizacion?.envoltura || ''}
                              onChange={(e) =>
                                actualizarPersonalizacion(id, { envoltura: e.target.value })
                              }
                              className="w-full mt-1 border border-pink-100 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition"
                            >
                              <option value="">Selecciona</option>
                              {OPCIONES_ENVOLTURA.map(op => (
                                <option key={op} value={op}>{op}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500">
                              Color preferido
                            </label>
                            <input
                              type="text"
                              value={item.personalizacion?.color || ''}
                              onChange={(e) =>
                                actualizarPersonalizacion(id, { color: e.target.value })
                              }
                              placeholder="Ej. Rosado"
                              className="w-full mt-1 border border-pink-100 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500">
                            Observaciones adicionales
                          </label>
                          <textarea
                            rows={2}
                            maxLength={200}
                            value={item.personalizacion?.observaciones || ''}
                            onChange={(e) =>
                              actualizarPersonalizacion(id, { observaciones: e.target.value })
                            }
                            placeholder="Alergias, hora de entrega, detalles especiales..."
                            className="w-full mt-1 border border-pink-100 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-2xl border border-pink-100 p-6">
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500">
                  Dirección de envío
                </label>
                <input
                  type="text"
                  value={direccionEnvio}
                  onChange={(e) => setDireccionEnvio(e.target.value)}
                  placeholder="Ej. Av. Amazonas y Naciones Unidas, Quito"
                  className="w-full mt-1 border border-pink-100 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition"
                />
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-400">Subtotal</span>
                <span className="text-sm font-semibold text-gray-700">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-5">
                <span className="text-sm text-gray-400">Envío</span>
                <span className="text-sm font-semibold text-[#00b1c1]">Gratis</span>
              </div>
              <div className="flex justify-between border-t border-pink-50 pt-4 mb-6">
                <span className="font-bold text-gray-700">Total</span>
                <span className="font-bold text-[#bd3869] text-lg">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePagar}
                disabled={loading || procesandoPago}
                className="w-full bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {procesandoPago ? 'Procesando...' : 'Proceder al pago'}
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default Carrito

