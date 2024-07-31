import React from "react"

import Viewer from "./Viewer"


const ViewerTest: React.FC = () => {

    return (
        <Viewer htmlContent={`
<p>Hello World!</p>
<p>½</p>
<p>—</p>
<p style="text-align: right">asdasd</p>
<p style="text-align: right">sad</p>
<p style="text-align: right">as</p>
<p style="text-align: right">dsa</p>
<p style="text-align: right"></p>
<flashcard title="CPU" content="side one" alternatecontent="side two"></flashcard>
<p>d</p>
<p>--</p>
<p>—</p>
            `
        }
        />
    )
}

export default ViewerTest