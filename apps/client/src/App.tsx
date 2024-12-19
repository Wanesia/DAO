import "@mantine/core/styles.css";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import { UserProvider } from "./context/UserContext";

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
      <UserProvider>
      <MantineProvider>
        <InnerApp />
      </MantineProvider>
      </UserProvider>
    </AuthProvider>
  );
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
