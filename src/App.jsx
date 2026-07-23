import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Catalogo from './pages/Catalogo'
import Perfil from './pages/Perfil'
import Carrito from './pages/Carrito'
import PagoExitoso from './pages/PagoExitoso'
import PagoCancelado from './pages/PagoCancelado'
import RecuperarPassword from './pages/RecuperarPassword'
import ResetPassword from './pages/ResetPassword'
import ConfirmarCuenta from './pages/ConfirmarCuenta'
import Dashboard from './layout/Dashboard'
import DashboardAdmin from './layout/DashboardAdmin'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import Favoritos from './pages/Favoritos'
import Pedidos from './pages/Pedidos'
import AdminDashboard from './pages/AdminDashboard'
import AdminPedidos from './pages/AdminPedidos'
import AdminProductos from './pages/AdminProductos'
import AdminClientes from './pages/AdminClientes'
import storeAuth from './context/storeAuth' 
import ChatBotIA from './components/ChatBotIA'



function App() {
  const { rol } = storeAuth();

  return (
       <>
    <BrowserRouter>

      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                <Home />
              </div>
              <Footer />
            </div>
          }
        />

        <Route
          path="/catalogo"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                <Catalogo />
              </div>
              <Footer />
            </div>
          }
        />

        <Route
          path="/carrito"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                <Carrito />
              </div>
              <Footer />
            </div>
          }
        />

        <Route path="/pago-exitoso" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1"><PagoExitoso /></div>
            <Footer />
          </div>
        } />

        <Route path="/pago-cancelado" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1"><PagoCancelado /></div>
            <Footer />
          </div>
        } />

        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />

        {/* REDIRECCIÓN SEGÚN ROL — 🛠️ corregido: el schema guarda "Admin" con mayúscula, no "admin" */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {rol === "Admin" ? (
                <Navigate to="/dashboard/admin" />
              ) : (
                <Navigate to="/dashboard/cliente" />
              )}
            </ProtectedRoute>
          }
        />

        {/* SOLO PARA NO LOGUEADOS */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* DASHBOARD CLIENTE */}
        <Route
          path="/dashboard/cliente/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route element={<Dashboard />}>
                  <Route index element={<Perfil />} />
                  <Route path="perfil" element={<Perfil />} />
                  <Route path="favoritos" element={<Favoritos />} />
                  <Route path="pedidos" element={<Pedidos />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD ADMIN */}
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route element={<DashboardAdmin />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="pedidos" element={<AdminPedidos />} />
                  <Route path="productos" element={<AdminProductos />} />
                  <Route path="clientes" element={<AdminClientes />} />
                  <Route path="perfil" element={<Perfil />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    <ChatBotIA />

       </>
  );
}

export default App;
