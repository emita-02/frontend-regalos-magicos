
import { Link, useLocation } from 'react-router-dom'
import rm from '../assets/RM.png'
import storeAuth from '../context/storeAuth'
import storeCarrito from '../context/storeCarrito'

function Navbar() {
  const { token, rol } = storeAuth()
  const usuarioLogueado = !!token
  const esAdmin = rol === 'Admin'
  const rutaPerfil = esAdmin ? '/dashboard/admin' : '/dashboard/cliente'
  const { carrito } = storeCarrito()
  const cantidadCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const location = useLocation()

  const esActivo = (ruta) => {
    if (ruta === '/') return location.pathname === '/'
    return location.pathname.startsWith(ruta)
  }
  const claseLink = (ruta) =>
    esActivo(ruta) ? 'text-[#00b1c1]' : 'hover:text-[#bd3869] transition'

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center px-12 h-20 bg-white border-b border-pink-100">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="font-bold text-[#bd3869]">
          <img
            src={rm}
            alt="Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Menú de Navegación */}
      <div className="hidden md:flex gap-8 text-base text-gray-400 font-bold ml-auto mr-6">
        {/* Redirige a la página de Inicio */}
        <Link to="/" className={claseLink('/')}>
          Inicio
        </Link>

        {/* Redirige exactamente a la página de Catálogo 🎁 */}
        <Link
          to="/catalogo"
          className={claseLink('/catalogo')}
        >
          Catálogo
        </Link>

        {/* Solo si está logueado: redirige al panel correcto según el rol */}
        {usuarioLogueado && (
          <Link
            to={rutaPerfil}
            className={claseLink('/dashboard')}
          >
            Mi perfil
          </Link>
        )}

        {/* Solo si está logueado: Redirige al Carrito */}
        {usuarioLogueado && (
          <Link
            to="/carrito"
            className="relative hover:text-[#bd3869] transition"
          >
            Carrito
            {cantidadCarrito > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#bd3869] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cantidadCarrito}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Botones de la esquina derecha */}
      <div className="flex items-center gap-4">
        {/* Si NO está logueado, muestra iniciar sesión */}
        {!usuarioLogueado && (
          <Link
            to="/login"
            className="bg-[#bd3869] text-white text-base font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
          >
            Iniciar sesión
          </Link>
        )}
      </div>

    </nav>
  )
}

export default Navbar