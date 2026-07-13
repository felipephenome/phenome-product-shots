import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss";
import { useThemeStore } from "./stores/themeStore";

const isDark = useThemeStore.getState().isDark;
document.documentElement.classList.toggle("dark", isDark);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
