import "@mantine/core/styles.css";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification/Notification";

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
      <NotificationProvider>
        <UserProvider>
          <MantineProvider>
            <Notification />
            <InnerApp />
          </MantineProvider>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
