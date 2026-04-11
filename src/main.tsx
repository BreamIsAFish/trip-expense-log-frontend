import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "@/auth/providers/AuthProvider";
import { LiffInitializer } from "@/auth/components/LiffInitializer";
import { useAuthStore } from "@/auth/stores/authStore";
import { attachAuthInterceptor } from "@/shared/api/interceptors";

import App from "./App";
import "./index.css";

attachAuthInterceptor(() => useAuthStore.getState().token);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LiffInitializer>
            <App />
          </LiffInitializer>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
