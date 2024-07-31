import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import Viewer from "./components/Viewer/Viewer.tsx"

const root = ReactDOM.createRoot( document.getElementById( "root" )! )

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// Attach the root and the viewer to the global window object,
// so they can be referenced from the static viewer page
declare global {
    interface Window {
        reactRoot: ReactDOM.Root;
        Viewer: React.FC<{htmlContent: string;}>;
    }
}
window.React = React
window.reactRoot = root
window.Viewer = Viewer

export default root