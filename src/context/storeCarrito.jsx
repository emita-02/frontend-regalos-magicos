import { create } from "zustand";

const storeCarrito = create((set, get) => ({

    // CARRITO
    carrito: [],

    agregarCarrito: (producto) => {
        const carrito = get().carrito;

        const id = producto._id || producto.id;

        const existe = carrito.find(
            item => (item._id || item.id) === id
        );

        if (existe) {

            set({
                carrito: carrito.map(item =>
                    (item._id || item.id) === id
                        ? {
                            ...item,
                            cantidad: item.cantidad + 1
                        }
                        : item
                )
            });

        } else {
            set({
                carrito: [
                    ...carrito,
                    {
                        ...producto,
                        cantidad: 1,
                        personalizacion: {
                            mensaje: "",
                            envoltura: "",
                            color: "",
                            observaciones: ""
                        }
                    }
                ]
            });
        }
    },
    
    eliminarCarrito: (id) => {

        set({
            carrito: get().carrito.filter(
                item => (item._id || item.id) !== id
            )
        });

    },

    aumentarCantidad: (id) => {

        set({
            carrito: get().carrito.map(item =>
                (item._id || item.id) === id
                    ? {
                        ...item,
                        cantidad: item.cantidad + 1
                    }
                    : item
            )
        });

    },

    disminuirCantidad: (id) => {

        set({
            carrito: get().carrito
                .map(item =>
                    (item._id || item.id) === id
                        ? {
                            ...item,
                            cantidad: item.cantidad - 1
                        }
                        : item
                )
                .filter(item => item.cantidad > 0)
        });

    },

    vaciarCarrito: () => {

        set({
            carrito: []
        });

    },

    // Permite fijar una cantidad exacta (ej. escrita a mano en un input del carrito)
    actualizarCantidad: (id, cantidad) => {

        const cantidadSegura = Math.max(1, Number(cantidad) || 1);

        set({
            carrito: get().carrito.map(item =>
                (item._id || item.id) === id
                    ? { ...item, cantidad: cantidadSegura }
                    : item
            )
        });

    },

    // Actualiza uno o varios campos de personalización de un producto del carrito
    // Ej: actualizarPersonalizacion(id, { mensaje: "Feliz cumpleaños" })
    actualizarPersonalizacion: (id, cambios) => {

        set({
            carrito: get().carrito.map(item =>
                (item._id || item.id) === id
                    ? {
                        ...item,
                        personalizacion: {
                            ...item.personalizacion,
                            ...cambios
                        }
                    }
                    : item
            )
        });

    },

    // Cantidad total de artículos (sumando cantidades) para mostrar en el badge del navbar
    obtenerCantidadTotal: () => {
        return get().carrito.reduce((acc, item) => acc + item.cantidad, 0);
    },

    // Total a pagar en dólares
    obtenerTotal: () => {
        return get().carrito.reduce(
            (acc, item) => acc + (item.precio || 0) * item.cantidad,
            0
        );
    }

}));

export default storeCarrito;