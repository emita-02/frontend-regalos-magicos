import { useState } from "react"
import { recomendarRegalos } from "../services/iaService"

const ChatBotIA = () => {
    const [abierto, setAbierto] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const [cargando, setCargando] = useState(false)
    const [resultados, setResultados] = useState([])
    const [error, setError] = useState("")

    const handleBuscar = async () => {
        if (!mensaje.trim()) return
        setCargando(true)
        setError("")
        try {
            const data = await recomendarRegalos(mensaje)
            setResultados(data.recomendaciones || [])
        } catch (err) {
            setError("Ocurrió un error al buscar recomendaciones")
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setAbierto(!abierto)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    background: "#ff6b9d",
                    color: "white",
                    fontSize: "24px",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 1000
                }}
            >
                💬
            </button>

            {abierto && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "320px",
                        maxHeight: "450px",
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        padding: "16px",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h4 style={{ marginTop: 0 }}>Asistente de regalos 🎁</h4>

                    <input
                        type="text"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="¿Qué regalo buscas?"
                        style={{ padding: "8px", marginBottom: "8px" }}
                        onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                    />

                    <button onClick={handleBuscar} disabled={cargando} style={{ marginBottom: "8px" }}>
                        {cargando ? "Buscando..." : "Buscar"}
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <div style={{ overflowY: "auto", flex: 1 }}>
                        {resultados.map((prod) => (
                            <div key={prod._id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                                <strong>{prod.nombre}</strong>
                                <p style={{ margin: "4px 0", fontSize: "13px" }}>{prod.descripcion}</p>
                                <span>${prod.precio}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatBotIA