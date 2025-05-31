import { createRoot } from "react-dom/client"
import "./app/css/index.css"
import App from "./app/App"
import { HashRouter } from "react-router"

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>
)
