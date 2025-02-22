// Add support for font sizing to tiptap
// From here: https://gist.github.com/gregveres/64ec1d8a733feb735b7dd4c46331abae

import { Extension } from "@tiptap/react"
import "@tiptap/extension-text-style"

export interface FontSizeOptions {
    types: string[];
}

declare module "@tiptap/react" {
    interface Commands<ReturnType> {
        fontSize: {
            /**
             * Set the font size
             */
            setFontSize: ( fontSize: string ) => ReturnType;
            /**
             * Unset the font size
             */
            unsetFontSize: () => ReturnType;
        };
    }
}

export const FontSize = Extension.create<FontSizeOptions>( {
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"],
        }
    },

    addGlobalAttributes() {
        return [
            {
                types      : this.options.types,
                attributes : {
                    fontSize: {
                        default   : null,
                        parseHTML : ( element ) =>
                            element.style.fontSize.replace( /['"]+/g, "" ),
                        renderHTML: ( attributes ) => {
                            if ( !attributes.fontSize ) {
                                return {}
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        },
                    },
                },
            },
        ]
    },

    addCommands() {
        return {
            setFontSize:
                ( fontSize ) =>
                    ( { chain } ) => {
                        return chain().setMark( "textStyle", { fontSize } ).run()
                    },
            unsetFontSize:
                () =>
                    ( { chain } ) => {
                        return chain()
                            .setMark( "textStyle", { fontSize: null } )
                            .removeEmptyTextStyle()
                            .run()
                    },
        }
    },
} )