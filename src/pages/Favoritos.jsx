import { FaHeart } from "react-icons/fa";
import storeCliente from "../context/storeCliente";

function Favoritos() {
  const { favoritos, agregarFavorito } = storeCliente();

  return (
    <div className="min-h-screen bg-[#fdf6f9] pt-28 px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">
          Mis <span className="text-[#bd3869]">Favoritos</span>
        </h1>

        {favoritos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <p className="text-6xl mb-4">💔</p>

            <h2 className="text-xl font-semibold text-gray-600">
              Aún no tienes favoritos
            </h2>

            <p className="text-gray-400 mt-2">
              Agrega productos dando clic en el corazón ❤️
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {favoritos.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden border border-pink-100 hover:shadow-xl transition"
              >
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  className="w-full h-66 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-700">
                    {item.nombre}
                  </h2>

                  <p className="text-sm text-gray-400 mt-2">{item.descripcion}</p>

                  <div className="flex justify-between items-center mt-5">
                    <span className="text-[#bd3869] font-bold">
                      ${Number(item.precio || 0).toFixed(2)}
                    </span>

                    <button
                      onClick={() => agregarFavorito(item)}
                      className="w-9 h-9 rounded-full border border-pink-200 flex justify-center items-center text-[#bd3869] hover:bg-[#fce8f3]"
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;
