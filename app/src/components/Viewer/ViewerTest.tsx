import React from "react"

import Viewer from "./Viewer"


const ViewerTest: React.FC = () => {

    return (
        <Viewer htmlContent={`
<h1 style="text-align: center">Hello World!</h1>
<p style="text-align: center">Welcome to my WYSIWYG Editor created.<br>Created with Tiptap and ProseMirror<br>Import
    From .docx Files!</p>
<h2 style="text-align: center">Embedded React Components!</h2>
<p style="text-align: center">They can even be exported and reimported!<br>Here’s a FlashCard component:</p>
<flashcard title="Flip Me!" content="Front Side Content" alternatecontent="Rear Side Content" data-input-props="{&quot;title&quot;:&quot;Flip Me!&quot;,&quot;content&quot;:&quot;Front Side Content&quot;,&quot;alternateContent&quot;:&quot;Rear Side Content&quot;}"></flashcard>
<p style="text-align: center">Code blocks with syntax highlighting, embedding videos, drag and drop images and other
    content, and all the important features you expect from a good WYSIWYG editor.<br>Here’s a code block with the HTML
    export for whats above:</p>
<pre><code>&lt;p&gt;&lt;/p&gt;
&lt;h1 style="text-align: center"&gt;Hello World!&lt;/h1&gt;
&lt;p style="text-align: center"&gt;Welcome to my WYSIWYG Editor.&lt;br&gt;Import From .docx Files!&lt;/p&gt;
&lt;h2 style="text-align: center"&gt;Embedded React Components!&lt;/h2&gt;
&lt;p style="text-align: center"&gt;They can even be exported and reimported!&lt;br&gt;Here’s a FlashCard component:&lt;/p&gt;
&lt;flashcard title="Flip Me!" content="Front Side Content" alternatecontent="Rear Side Content"&gt;&lt;/flashcard&gt;
&lt;p&gt;&lt;/p&gt;</code></pre>
<p></p>
            `
        }
        />
    )
}

export default ViewerTest