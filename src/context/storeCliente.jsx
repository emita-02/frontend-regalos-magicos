// src/context/storeCliente.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const storeCliente = create(
  persist(
    (set, get) => ({
      favoritos: [],
      carrito: [],

      agregarFavorito: (producto) => {
        const yaExiste = get().favoritos.some((f) => f._id === producto._id);
        set({
          favoritos: yaExiste
            ? get().favoritos.filter((f) => f._id !== producto._id) // toggle: si ya está, lo quita
            : [...get().favoritos, producto],
        });
      },

      // 🆕 Faltaba esta función: CardProducto la necesita para saber si pintar el corazón lleno o vacío
      esFavorito: (id) => {
        return get().favoritos.some((f) => f._id === id);
      },

      // producto debe traer el _id real de MongoDB (viene del Catálogo conectado a la API)
      agregarAlCarrito: (producto) => {
        const existente = get().carrito.find((i) => i._id === producto._id);
        if (existente) {
          set({
            carrito: get().carrito.map((i) =>
              i._id === producto._id ? { ...i, cantidad: i.cantidad + 1 } : i,
            ),
          });
        } else {
          set({ carrito: [...get().carrito, { ...producto, cantidad: 1 }] });
        }
      },

      aumentarCantidad: (id) =>
        set({
          carrito: get().carrito.map((i) =>
            i._id === id ? { ...i, cantidad: i.cantidad + 1 } : i,
          ),
        }),

      disminuirCantidad: (id) =>
        set({
          carrito: get().carrito.map((i) =>
            i._id === id && i.cantidad > 1
              ? { ...i, cantidad: i.cantidad - 1 }
              : i,
          ),
        }),

      eliminarDelCarrito: (id) =>
        set({
          carrito: get().carrito.filter((i) => i._id !== id),
        }),

      limpiarCarrito: () => set({ carrito: [] }),
    }),
    { name: "cliente-storage" },
  ),
);

export default storeCliente;
