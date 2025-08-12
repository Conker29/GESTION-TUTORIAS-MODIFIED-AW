/* eslint-disable no-irregular-whitespace */
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import { Forgot } from "./pages/Forgot";
import { Confirm } from "./pages/Confirm";
import { NotFound } from "./pages/NotFound";
import Dashboard from "./layout/Dashboard";
import Profile from "./pages/Profile";
import List from "./pages/List";
import Details from "./pages/Details";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Chat from "./pages/Chat";
import Reset from "./pages/Reset";

import DashboardHome from "./layout/DashboardHome";
import Settings from "./pages/Settings";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import PrivateRouteWithRole from "./routes/PrivateRouteWithRole";

import { useEffect } from "react";
import storeProfile from "./context/storeProfile";
import storeAuth from "./context/storeAuth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AgendarDisponibilidad from "./pages/Docente/AgendarDisponibilidad";
import VerDisponibilidad from "./pages/Docente/VerDisponibilidad";
import TutoriasSemana from "./pages/Docente/TutoriasSemana";
import AgendarTutorias from "./pages/Estudiante/AgendarTutorias";
import MisTutorias from "./pages/Estudiante/MisTutorias";

function App() {
  const { profile } = storeProfile();
  const { token } = storeAuth();

  useEffect(() => {
    if (token) {
      profile();
    }
  }, [token, profile]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot/:id" element={<Forgot />} />
            <Route path="confirmar/:token" element={<Confirm />} />
            <Route path="reset/:token" element={<Reset />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Rutas protegidas por autenticación */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />

            {/* RUTAS COMPARTIDAS */}
            <Route path="perfil" element={<Profile />} />
            <Route path="configuracion" element={<Settings />} />
            <Route path="chat" element={<Chat />} />

            {/* RUTAS ADMIN */}
            <Route
              path="listar"
              element={
                <PrivateRouteWithRole requiredRole="Administrador">
                  <List />
                </PrivateRouteWithRole>
              }
            />
            <Route
              path="crear"
              element={
                <PrivateRouteWithRole requiredRole="Administrador">
                  <Create />
                </PrivateRouteWithRole>
              }
            />
            <Route
              path="visualizar/:id"
              element={
                <PrivateRouteWithRole requiredRole="Administrador">
                  <Details />
                </PrivateRouteWithRole>
              }
            />
            <Route
              path="actualizar/:id"
              element={
                <PrivateRouteWithRole requiredRole="Administrador">
                  <Update />
                </PrivateRouteWithRole>
              }
            />

            {/* RUTAS DOCENTE */}
            <Route
              path="agendar-disponibilidad"
              element={
                <PrivateRouteWithRole requiredRole="Docente">
                  <AgendarDisponibilidad />
                </PrivateRouteWithRole>
              }
            />
            <Route
              path="ver-disponibilidad-docente/:docenteId"
              element={
                <PrivateRouteWithRole requiredRoles = {["Docente", "Estudiante"]}>
                  <VerDisponibilidad />
                </PrivateRouteWithRole>
              }
            />
            <Route
              path="tutorias-semana"
              element={
                <PrivateRouteWithRole requiredRole="Docente">
                  <TutoriasSemana />
                </PrivateRouteWithRole>
              }
            />

            {/* RUTAS ESTUDIANTE */}
            <Route
              path="agendar-tutorias"
              element={
                <PrivateRouteWithRole requiredRole="Estudiante">
                  <AgendarTutorias />
                </PrivateRouteWithRole>
              }
            />
            <Route
              path="ver-tutorias"
              element={
                <PrivateRouteWithRole requiredRole="Estudiante">
                  <MisTutorias />
                </PrivateRouteWithRole>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
