import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeAccentProvider } from "./hooks/useThemeAccent";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeAccentProvider>
      <App />
    </ThemeAccentProvider>
  </React.StrictMode>
);