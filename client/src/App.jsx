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
import { Donor } from "./pages/Donor"
import { protectedLoader } from "./utils/loader"
import { Ngo } from "./pages/Ngo"

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
        { path: "donor", element: <Donor />, loader: protectedLoader(["donor"]) },
        { path: "ngo", element: <Ngo />, loader: protectedLoader(["ngo"]) },
      ],
    },
  ])
  return <RouterProvider router={router} />;
}