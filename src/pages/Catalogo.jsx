import { useState, useEffect } from 'react'
import axios from 'axios'
import CardProducto from "../components/CardProducto";

function Catalogo() {

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarCatalogo = async () => {
      setCargando(true)
      setError(null)
      try {
        const baseTienda = import.meta.env.VITE_BACKEND_URL

        const [resProductos, resCategorias] = await Promise.all([
          axios.get(`${baseTienda}/tienda/productos`),
          axios.get(`${baseTienda}/tienda/categorias`)
        ])

        setProductos(resProductos.data)
        setCategorias(resCategorias.data)
      } catch (err) {
        console.error("ERROR AL CARGAR CATÁLOGO:", err)
        setError("No pudimos cargar el catálogo. Intenta de nuevo en un momento.")
      } finally {
        setCargando(false)
      }
    }

    cargarCatalogo()
  }, [])

  const nombresCategorias = ['Todos', ...categorias.map(c => c.nombre)]

  const productosFiltrados = productos.filter(p => {
    const nombreCategoria = p.categoria?.nombre || ''
    const coincideCategoria = categoriaActiva === 'Todos' || nombreCategoria === categoriaActiva
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (

    <div className="min-h-screen bg-[#fdf6f9] pt-24">

      <div className="bg-white border-b border-pink-100 px-12 py-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-1">
          Nuestro <span className="text-[#bd3869]">Catálogo</span>
        </h1>
        <p className="text-gray-400 text-sm">Encuentra el regalo perfecto para cada ocasión</p>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border border-pink-100 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#00b1c1] transition w-full md:w-72"
          />
          <div className="flex gap-2 flex-wrap">
            {nombresCategorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  categoriaActiva === cat
                    ? 'bg-[#bd3869] text-white'
                    : 'bg-white border border-pink-100 text-gray-400 hover:border-[#bd3869] hover:text-[#bd3869]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-12 py-8 max-w-6xl mx-auto">
        {cargando ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 animate-pulse">🎁</p>
            <p className="text-gray-400 text-sm">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-pink-100">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎁</p>
            <p className="text-gray-400 text-sm">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productosFiltrados.map(item => (
              <CardProducto
                key={item._id}
                producto={item}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Catalogo