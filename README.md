### WYSIWYG-TipTap-React

This project is a WYSIWYG Editor based on TipTap/ProseMirror that supports embedding any React component that is in a specified format. A sample FlashCard component is included for example.

The `Editor` component supports importing from .docx files using the mammoth.js library.

The editor supports saving to a HTML format where the React components use custom HTML tags and HTML attributes to store their properties.
This HTML can be loaded back into the editor and the React components reinstated from the custom HTML tags.

The project also contains a `Viewer` component that can load the HTML with the custom tags and reinstate the React Components to be viewed statically without editing capability.

There is also a stand-alone `viewer_page.html` which loads the Viewer Component and accompanying HTML that can be embedded into Brightspace.



### Development Environment

To run the the project development environment:

```
cd app
pnpm i
pnpm run dev
```

### Development Notes

The React components the editor supports are defined in `app/src/components/Editor/custom-nodes/CustomNodes.ts`, they are in a specified format defined by the `ComponentConfig` interface in the adjacent `CustomNodeGenerator.ts` file.

The format for `inputProps` currently specifies the name of the prop and the HTML input type to be used to gather it, which the `ComponentPropsModal.tsx` uses when inserting the component.

This should be reconsidered as it may not be viable for components with more complex input props, it may be better to have each component define an additional component and function for gathering their props.

The limitations of HTML attributes to store props should also be considered, and perhaps a single attribute with stringified JSON data be used.

Currently the Editor component works fine with converting the props, however the Viewer is not using Tiptap/ProseMirror directly,
meaning that the components must only use props with all lowercase names as that is how HTML attributes work


## LICENCE - MIT

```
These files are part of the TipTap Based WYSIWYG Editor and Viewer
that supports React Components.
Copyright (C) 2024, Anthony Donato

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