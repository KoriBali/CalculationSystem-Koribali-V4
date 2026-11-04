import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../index.css";
import App from "./App.jsx";

// Disable mouse wheel increment/decrement on number inputs globally
document.addEventListener(
  "wheel",
  () => {
    if (
      document.activeElement &&
      document.activeElement.tagName === "INPUT" &&
      document.activeElement.type === "number"
    ) {
      document.activeElement.blur();
    }
  },
  { passive: true }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
