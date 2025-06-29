import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/styles/index.css";
import "@/styles/tailwind.css";

// Importa e inicializa o i18n
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
