import { FaHeart, FaRegHeart } from "react-icons/fa";
import storeCliente from "../context/storeCliente";
import storeAuth from "../context/storeAuth";
import storeCarrito from "../context/storeCarrito";

function CardProducto({ producto }) {

    const { agregarFavorito, esFavorito } = storeCliente();

    const { token } = storeAuth();

    const usuarioLogueado = !!token;

    // Compatibilidad: acepta tanto el producto real del backend
    // (imagenUrl, descripcion, categoria: { nombre }, _id) como los
    // datos de ejemplo que todavía usa Home.jsx (img, desc, categoria string, id)
    const id = producto._id || producto.id;
    const imagen = producto.imagenUrl || producto.img;
    const descripcion = producto.descripcion || producto.desc;
    const nombreCategoria = producto.categoria?.nombre || producto.categoria;
    const precioFormateado = typeof producto.precio === 'number'
        ? `$${producto.precio.toFixed(2)}`
        : producto.precio;

    const { agregarCarrito } = storeCarrito();
    
        return (

        <div className="group relative bg-white rounded-2xl border border-pink-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">

            <img
                src={imagen}
                alt={producto.nombre}
                className="w-full h-66 object-cover"
            />

            <div className="p-5">

                {
                    nombreCategoria && (

                        <span className="text-xs font-semibold text-[#00b1c1] bg-[#e8f7f9] px-2 py-1 rounded-full">

                            {nombreCategoria}

                        </span>

                    )
                }

                <h3 className="text-lg font-semibold text-gray-700 mt-3">

                    {producto.nombre}

                </h3>

                <p className="text-sm text-gray-400 mt-2 mb-5">

                    {descripcion}

                </p>

                <div className="flex justify-between items-center">

                    <span className="font-bold text-[#bd3869]">

                        {precioFormateado}

                    </span>

                    {

                        usuarioLogueado ? (

                            <div className="flex gap-2">

                                <button
                                    onClick={() => agregarFavorito(producto)}
                                    className="w-8 h-8 rounded-full border border-pink-200 text-[#bd3869] flex justify-center items-center hover:bg-[#fce8f3]"
                                >

                                    {

                                        esFavorito(id)

                                            ?

                                            <FaHeart size={14} />

                                            :

                                            <FaRegHeart size={14} />

                                    }

                                </button>

                                <button
                                    onClick={() => agregarCarrito(producto)}
                                    className="w-8 h-8 rounded-full bg-[#00b1c1] text-white hover:opacity-80"
                                >

                                    +

                                </button>

                            </div>

                        )

                            :

                        <button
                            className="w-8 h-8 rounded-full border border-pink-200 text-[#bd3869] flex justify-center items-center hover:bg-[#fce8f3]"
                        >

                            <FaRegHeart size={14} />

                        </button>

                    }

                </div>

            </div>

            {

                !usuarioLogueado && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <div className="bg-white px-5 py-3 rounded-2xl shadow-lg">
                            <p className="text-sm font-semibold text-[#bd3869] text-center">
                                Debes iniciar sesión para comprar
                            </p>
                        </div>
                    </div>
                )}
        </div>

    );

}

export default CardProducto;