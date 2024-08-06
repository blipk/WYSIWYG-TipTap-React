### WYSIWYG-TipTap-React

This project is a WYSIWYG Editor based on Tiptap/ProseMirror that supports embedding any React Component into the editor.

A sample `FlashCard` React Component is included for example.

The project is written in TypeScript and is fully typed with minimal usage of `any` and no usage of `unknown`.

##### Editor Component

The `Editor` component supports everything you would expect from a rich WYSIWYG editor including:
 - Code blocks with syntax highlighting
 - Embedding YouTube videos
 - Embedding images
 - Drag and drop images or text content

It also has these special features:
 - Embedding any React Component (requires some minor adjustments to your component)
 - Importing from .docx files using the mammoth.js library
 - Exporting to and loading from HTML format, including the embedded React Components

When exporting to the HTML format the React Components use a custom named HTML tag and their props are stored in HTML attributes.

Here's what it looks like:
![Image of the Editor Component](/docs/editor.png "Editor")

Here is a video showing the React Component in action: [Demo Video](./docs/editor_demo.mp4)

##### Viewer Component
The project also contains a `Viewer` component that can statically display all the same content as the `Editor`, including reinstating the embedded React Components.

###### Stand-alone Viewer Page

There is also a stand-alone `viewer_page.html` which loads the `Viewer` component and accompanying HTML that can be embedded into an iframe or otherwise.

![Image of the Viewer Component](/docs/viewer.png "Viewer")

See the [Standalone Viewer Readme](./app/src/components/Viewer/standalone/README.md) for more information on that.



##### Development Environment

To use the `Editor` install the dependencies and run the development environment:
```
cd app
pnpm i
pnpm run dev
```

### Development Notes

The React components the editor supports are defined in `./app/src/components/Editor/custom-nodes/CustomNodes.ts`, they are in a specified format defined by the `ComponentConfig` interface in the adjacent `CustomNodeGenerator.ts` file.

The format for `inputProps` currently specifies the name of the prop (which should match the name of the components actual props) and the HTML input type to be used to gather it, which the `ComponentPropsModal.tsx` uses when inserting the component.

This should be reconsidered as it may not be viable for components with more complex input props, it may be better to have each component define an additional component and function for gathering their props.


### LICENCE - MIT

```
These files are part of the Tiptap Based WYSIWYG Editor and Viewer
that supports embedding React Components (WYSIWYG-TipTap-React).
Copyright (C) 2024, A.D.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```