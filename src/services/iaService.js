import axios from "axios"

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const recomendarRegalos = async (busquedaHumana, presupuestoMaximo, ocasion) => {
    const { data } = await axios.post(`${backendUrl}/ia/recomendar`, {
        busquedaHumana,
        presupuestoMaximo,
        ocasion
    })
    return data
}