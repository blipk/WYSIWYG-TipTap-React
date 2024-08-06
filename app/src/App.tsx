import React from "react"
import "./css/no.css"
import "./css/App.css"

import DocxEditor from "./components/Editor/Editor"
// import ViewerTest from "./components/Viewer/ViewerTest"


const App: React.FC = () => {
    return (
        <div>
            <DocxEditor/>
            {/* <ViewerTest/> */}
        </div>
    )
}

export default App
