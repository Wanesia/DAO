import "@mantine/core/styles.css";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";

const router = createRouter({
  routeTree,
  context: undefined!, 
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <AuthProvider>
      <MantineProvider>
        <InnerApp />
      </MantineProvider>
    </AuthProvider>
  );
}

function InnerApp() {
  const auth = useAuth(); 

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
