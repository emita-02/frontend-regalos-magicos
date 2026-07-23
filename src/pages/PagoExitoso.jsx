import { Link, useSearchParams } from 'react-router-dom'

function PagoExitoso() {
  const [searchParams] = useSearchParams()
  const pedido = searchParams.get('pedido')

  return (
    <div className="min-h-screen bg-[#fdf6f9] flex items-center justify-center px-6 pt-20">
      <div className="bg-white max-w-md w-full rounded-3xl border border-pink-100 p-10 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">¡Pago exitoso!</h1>
        <p className="text-sm text-gray-400 mb-1">
          Tu pedido fue confirmado y ya lo estamos preparando.
        </p>
        {pedido && (
          <p className="text-xs text-gray-300 mb-6">N° de pedido: {pedido}</p>
        )}
        <div className="flex flex-col gap-3 mt-6">
          <Link
            to="/dashboard/cliente/pedidos"
            className="w-full bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/catalogo"
            className="w-full border border-pink-100 text-gray-500 py-3 rounded-xl text-sm font-semibold hover:border-[#bd3869] hover:text-[#bd3869] transition"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PagoExitoso
