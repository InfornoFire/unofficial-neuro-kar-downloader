import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { GDRIVE_OAUTH2_CLIENT_ID } from "./api/drive";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GDRIVE_OAUTH2_CLIENT_ID}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
