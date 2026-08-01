import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./components/AppLayout"
import { Home } from "./pages/Home"
import { Contact } from "./pages/Contact"

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/contact-us", element: <Contact /> }
      ],
    },
  ])
  return <RouterProvider router={router} />;
}