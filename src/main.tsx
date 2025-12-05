import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./registerServiceWorker";

createRoot(document.getElementById("root")!).render(<App />);

// Service Worker ni register qilish (xabarsiz)
registerServiceWorker();

// PWA Install Prompt ni to'xtatish
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  console.log('PWA install prompt blocked');
});