import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import storeAuth from "../context/storeAuth";

function AdminProductos() {
  const { fetchDataBackend, loading } = useFetch();
  const { token } = storeAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null); // null = modo "crear"

  // 🆕 Modal secundario para crear una categoría sin salir del formulario de producto
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState("");

  const cargarProductos = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/tienda/productos`;
    const data = await fetchDataBackend(url, null, "GET");
    if (data) setProductos(data);
  };

  const cargarCategorias = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/tienda/categorias`;
    const data = await fetchDataBackend(url, null, "GET");
    if (data) setCategorias(data);
  };

  const abrirModalCategoria = () => {
    setNombreCategoria("");
    setDescripcionCategoria("");
    setErrorCategoria("");
    setModalCategoriaAbierto(true);
  };

  const guardarCategoria = async () => {
    if (!nombreCategoria.trim()) {
      setErrorCategoria("El nombre de la categoría es obligatorio");
      return;
    }

    setGuardandoCategoria(true);
    setErrorCategoria("");

    const url = `${import.meta.env.VITE_BACKEND_URL}/tienda/categorias`;
    const response = await fetchDataBackend(
      url,
      { nombre: nombreCategoria.trim(), descripcion: descripcionCategoria.trim() },
      "POST",
      { Authorization: `Bearer ${token}` },
    );

    setGuardandoCategoria(false);

    if (response?.nuevaCategoria) {
      await cargarCategorias();
      // La dejamos ya seleccionada en el formulario de producto que está abierto detrás
      setValue("categoria", response.nuevaCategoria._id);
      setModalCategoriaAbierto(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const abrirModalCrear = () => {
    setProductoEditando(null);
    reset({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoEditando(producto);
    setValue("nombre", producto.nombre);
    setValue("descripcion", producto.descripcion);
    setValue("precio", producto.precio);
    setValue("stock", producto.stock);
    setValue("categoria", producto.categoria?._id || "");
    setModalAbierto(true);
  };

  const guardarProducto = async (dataForm) => {
    const formData = new FormData();
    formData.append("nombre", dataForm.nombre);
    formData.append("descripcion", dataForm.descripcion);
    formData.append("precio", dataForm.precio);
    formData.append("stock", dataForm.stock);
    formData.append("categoria", dataForm.categoria);

    // La imagen es opcional al editar (si no seleccionan una nueva, se mantiene la actual)
    if (dataForm.imagen && dataForm.imagen[0]) {
      formData.append("imagenUrl", dataForm.imagen[0]);
    }

    const esEdicion = !!productoEditando;
    const url = esEdicion
      ? `${import.meta.env.VITE_BACKEND_URL}/tienda/productos/${productoEditando._id}`
      : `${import.meta.env.VITE_BACKEND_URL}/tienda/productos`;

    const response = await fetchDataBackend(
      url,
      formData,
      esEdicion ? "PUT" : "POST",
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (response) {
      reset();
      setModalAbierto(false);
      setProductoEditando(null);
      cargarProductos();
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.",
    );
    if (!confirmar) return;

    const url = `${import.meta.env.VITE_BACKEND_URL}/tienda/productos/${id}`;
    const response = await fetchDataBackend(url, null, "DELETE", {
      Authorization: `Bearer ${token}`,
    });

    if (response) {
      cargarProductos();
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Productos</h1>
          <p className="text-sm text-gray-400">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="bg-[#bd3869] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fdf6f9]">
            <tr>
              <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-gray-500 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  Cargando productos...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p._id} className="border-t border-pink-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {p.nombre}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#bd3869]">
                    ${Number(p.precio).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {p.categoria?.nombre || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.stock}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => abrirModalEditar(p)}
                      className="border border-[#00b1c1] text-[#00b1c1] px-3 py-1 rounded-xl text-xs font-semibold hover:bg-[#e8f7f9] transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(p._id)}
                      className="border border-red-200 text-red-400 px-3 py-1 rounded-xl text-xs font-semibold hover:bg-red-50 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-700 mb-6">
              {productoEditando ? "Editar producto" : "Nuevo producto"}
            </h2>
            <form
              onSubmit={handleSubmit(guardarProducto)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full border border-pink-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00b1c1]"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {errors.nombre && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Descripción
                </label>
                <textarea
                  className="w-full border border-pink-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00b1c1]"
                  {...register("descripcion", {
                    required: "La descripción es obligatoria",
                  })}
                />
                {errors.descripcion && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border border-pink-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00b1c1]"
                    {...register("precio", {
                      required: "El precio es obligatorio",
                    })}
                  />
                  {errors.precio && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.precio.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="w-full border border-pink-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00b1c1]"
                    {...register("stock", {
                      required: "El stock es obligatorio",
                    })}
                  />
                  {errors.stock && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-500 block">
                    Categoría
                  </label>
                  <button
                    type="button"
                    onClick={abrirModalCategoria}
                    className="text-xs font-semibold text-[#00b1c1] hover:underline"
                  >
                    + Nueva categoría
                  </button>
                </div>
                <select
                  className="w-full border border-pink-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00b1c1]"
                  {...register("categoria", {
                    required: "La categoría es obligatoria",
                  })}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.categoria.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Imagen{" "}
                  {productoEditando && (
                    <span className="text-gray-400 font-normal">
                      (déjalo vacío para mantener la actual)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  {...register("imagen", {
                    required: productoEditando
                      ? false
                      : "La imagen es obligatoria",
                  })}
                />
                {errors.imagen && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.imagen.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading
                    ? "Guardando..."
                    : productoEditando
                      ? "Guardar cambios"
                      : "Crear producto"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalAbierto(false);
                    setProductoEditando(null);
                    reset();
                  }}
                  className="flex-1 border border-pink-100 text-gray-400 py-3 rounded-xl text-sm font-semibold hover:bg-[#fdf6f9] transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🆕 Modal secundario: crear categoría sin salir del formulario de producto */}
      {modalCategoriaAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-6">
              Nueva categoría
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombreCategoria}
                  onChange={(e) => setNombreCategoria(e.target.value)}
                  className="w-full border border-pink-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#00b1c1]"
                  placeholder="Ej. Desayunos sorpresa"
                />
                {errorCategoria && (
                  <p className="text-red-400 text-xs mt-1">{errorCategoria}</p>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={guardarCategoria}
                  disabled={guardandoCategoria}
                  className="flex-1 bg-[#bd3869] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {guardandoCategoria ? "Guardando..." : "Crear categoría"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategoriaAbierto(false)}
                  className="flex-1 border border-pink-100 text-gray-400 py-3 rounded-xl text-sm font-semibold hover:bg-[#fdf6f9] transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;