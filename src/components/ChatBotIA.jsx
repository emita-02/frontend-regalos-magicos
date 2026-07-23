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
        {/* Contenedor flotante */}
        <div
            style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "12px",
            }}
        >
            {/* Mensaje inicial */}
            {!abierto && (
                <div
                    style={{
                        background: "#fff",
                        width: "260px",
                        padding: "16px",
                        borderRadius: "18px",
                        border: "1px solid #fde2ec",
                        boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 600,
                            color: "#444",
                            marginBottom: "6px",
                        }}
                    >
                        Asistente IA ✨
                    </p>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#888",
                        }}
                    >
                        Hola 👋 ¿Necesitas ayuda para elegir un regalo?
                    </p>
                </div>
            )}

            {/* Ventana del chat */}
            {abierto && (
                <div
                    style={{
                        width: "340px",
                        height: "470px",
                        background: "#fff",
                        borderRadius: "22px",
                        overflow: "hidden",
                        boxShadow: "0 15px 40px rgba(0,0,0,.18)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "#bd3869",
                            color: "#fff",
                            padding: "16px",
                            fontWeight: 600,
                            fontSize: "17px",
                        }}
                    >
                        🎁 Asistente IA
                    </div>

                    {/* Contenido */}
                    <div
                        style={{
                            flex: 1,
                            padding: "16px",
                            overflowY: "auto",
                            background: "#fafafa",
                        }}
                    >
                        {resultados.length === 0 && (
                            <p
                                style={{
                                    color: "#777",
                                    fontSize: "14px",
                                }}
                            >
                                Escribe qué tipo de regalo buscas y te ayudaré a
                                encontrar las mejores opciones.
                            </p>
                        )}

                        {resultados.map((prod) => (
                            <div
                                key={prod._id}
                                style={{
                                    background: "#fff",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    marginBottom: "12px",
                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,.05)",
                                }}
                            >
                                <strong>{prod.nombre}</strong>

                                <p
                                    style={{
                                        margin: "8px 0",
                                        fontSize: "13px",
                                        color: "#666",
                                    }}
                                >
                                    {prod.descripcion}
                                </p>

                                <span
                                    style={{
                                        color: "#bd3869",
                                        fontWeight: "bold",
                                    }}
                                >
                                    ${prod.precio}
                                </span>
                            </div>
                        ))}

                        {error && (
                            <p style={{ color: "red" }}>{error}</p>
                        )}
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: "16px",
                            borderTop: "1px solid #eee",
                            display: "flex",
                            gap: "8px",
                        }}
                    >
                        <input
                            type="text"
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleBuscar()
                            }
                            placeholder="¿Qué regalo buscas?"
                            style={{
                                flex: 1,
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                padding: "10px 14px",
                                outline: "none",
                            }}
                        />

                        <button
                            onClick={handleBuscar}
                            disabled={cargando}
                            style={{
                                background: "#bd3869",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                padding: "0 18px",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            {cargando ? "..." : "➜"}
                        </button>
                    </div>
                </div>
            )}

            {/* Botón flotante */}
            <button
                onClick={() => setAbierto(!abierto)}
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#bd3869",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "28px",
                    boxShadow: "0 10px 25px rgba(189,56,105,.35)",
                    transition: "all .25s ease",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.08)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                }
            >
                💬
            </button>
        </div>
    </>
);
}

export default ChatBotIA