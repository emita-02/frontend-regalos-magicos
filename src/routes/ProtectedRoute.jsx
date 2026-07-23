import { Navigate } from "react-router-dom"
import storeAuth from "../context/storeAuth"

const ProtectedRoute = ({ children }) => {
    const token = storeAuth(state => state.token)
    return token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
