import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./components/AppLayout"
import { Home } from "./pages/Home"
import { Contact } from "./pages/Contact"
import { Register } from "./pages/Register"
import { DonorRegisterForm } from "./components/DonorRegisterForm"
import { NgoRegisterForm } from "./components/NgoRegisterForm"
import { VerifyEmail } from "./pages/VerifyEmail"
import { Login } from "./pages/Login"
import { ForgetPassword } from "./pages/ForgetPassword"
import { ChangeEmail } from "./pages/ChangeEmail"
import { Loading } from "./components/Loading"
import { ErrorPage } from "./pages/ErrorPage"
import { DonorDashboard } from "./pages/DonorDashboard"
import { protectedLoader } from "./utils/loader"
import { Ngo } from "./pages/Ngo"
import { DonorLayout } from "./components/DonorLayout"
import { ProfileSetup } from "./components/ProfileSetup"
import { Donations } from "./pages/Donations"
import { DonorManagement } from "./pages/admin/DonorManagement"
import { NgoManagement } from "./pages/admin/NgoManagement"
import {AdminDashboard} from "./pages/admin/AdminDashboard"
import NgoRequest from "./pages/ngo/NgoRequest"
import DeliveryPartnerRegister from "./pages/DeliveryPartnerRegister"
import DeliveryPartnerDashboard from "./pages/DeliveryPartnerDashboard"
import {AdminDeliveryVerification} from "./pages/admin/AdminDeliveryVerification"
import {NGODeliveries} from "./pages/NGODeliveries"

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: "contact-us", element: <Contact /> },
        { path: "register", element: <Register /> },
        { path: "register-donor", element: <DonorRegisterForm /> },
        { path: "register-ngo", element: <NgoRegisterForm /> },
        { path: "verify-email/:token", element: <VerifyEmail /> },
        { path: "login", element: <Login /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "change-email", element: <ChangeEmail /> },
      ],
    },
    {
      path: "/donor",
      element: <DonorLayout />,
      errorElement: <ErrorPage />,
      loader: protectedLoader(["donor"]),
      children: [
        { path: "dashboard", element: <DonorDashboard /> },
        { path: "donations", element: <Donations /> },
        { path: "profile-setup", element: <ProfileSetup /> }
      ],
    },
    {
      path: "/ngo",
      errorElement: <ErrorPage />,
      loader: protectedLoader(["ngo"]),
      children: [
        { index: true, element: <Ngo /> },
         { path: "request", element: <NgoRequest /> },
          { path: "donation", element: <NGODeliveries /> },
      ],
    },
    {
      path: "/admin",
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "delivery-verification", element: <AdminDeliveryVerification /> },
        { path: "donor-management", element: <DonorManagement /> },
        { path: "ngo-management", element: <NgoManagement /> },
      ],
    },
    {
      path: "/delivery",
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <DeliveryPartnerDashboard /> },
        { path: "register", element: <DeliveryPartnerRegister /> },
      ],
    },
  ])
  return <RouterProvider router={router} />;
}