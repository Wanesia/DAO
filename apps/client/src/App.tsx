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
    <AuthProvider>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;
