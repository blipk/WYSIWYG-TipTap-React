import { Mark } from "@tiptap/react"

// This allows us to use the HTML style attribute on span elements in the tiptap editor
// The purpose of this is so that we can apply font-size styling from docx documents imported from mammothjs

const CustomMark = Mark.create( {
    name: "style",

    addAttributes() {
        return {
            color: {
                default    : null,
                parseHTML  : element => element.style.color || null,
                renderHTML : attributes => {
                    if ( !attributes.color ) {
                        return {}
                    }
                    return { style: `color: ${attributes.color};` }
                },
            },
            fontSize: {
                default    : null,
                parseHTML  : element => element.style.fontSize || null,
                renderHTML : attributes => {
                    if ( !attributes.fontSize ) {
                        return {}
                    }
                    return { style: `font-size: ${attributes.fontSize};` }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: "span[style]",
            },
        ]
    },

    renderHTML( { HTMLAttributes } ) {
        return ["span", HTMLAttributes, 0]
    },
} )

export default CustomMark