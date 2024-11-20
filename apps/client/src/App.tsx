import "@mantine/core/styles.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
<<<<<<< HEAD
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
=======
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
>>>>>>> 4e933a5 (add ensemble route)
  );
}

export default App;
