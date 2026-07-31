import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./components/AppLayout"
import { Home } from "./pages/Home"

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> }
      ],
    },
  ])
  return <RouterProvider router={router} />;
}