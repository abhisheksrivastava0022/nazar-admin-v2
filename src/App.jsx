import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes.jsx";
// import { routes } from "./routes/routes copy 2.jsx";

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_APP_BASE_PREFIX || "/",
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
