import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App.tsx";

const root = document.getElementById("root")!;

Modal.setAppElement(root);
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
