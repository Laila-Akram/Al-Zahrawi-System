import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId="662039386571-jha3re1h9se0bpbkl30qbj0v0nmh99ft.apps.googleusercontent.com"
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);