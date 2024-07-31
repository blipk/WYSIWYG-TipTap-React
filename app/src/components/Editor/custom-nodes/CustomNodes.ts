import { generateCustomNodes, ComponentConfig } from "./CustomNodeGenerator"

import FlashCard from "../../FlashCard/FlashCard"

// https://github.com/ueberdosis/tiptap/issues/2986

const customComponents: ComponentConfig[] = [
    {
        name       : "FlashCard",
        component  : FlashCard,
        inputProps : {
            "title"            : "text",
            "content"          : "text",
            "alternateContent" : "text",
        }
    },
]

const customComponentsNodes = generateCustomNodes( customComponents )

export { customComponents, customComponentsNodes }