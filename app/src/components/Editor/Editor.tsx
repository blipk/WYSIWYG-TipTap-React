import React, { useRef } from "react"

import * as mammoth from "mammoth"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import ListKeymap from "@tiptap/extension-list-keymap"
import TextStyle from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import FontFamily from "@tiptap/extension-font-family"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Typography from "@tiptap/extension-typography"
import { Color } from "@tiptap/extension-color"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"

// CodeBlock highlighting support
import { common, createLowlight } from "lowlight"
const lowlight = createLowlight( common )
import "../../../node_modules/highlight.js/styles/vs2015.css"


// TODO add/configure these
// mammothjs does not currently support importing color information although there is some patches in their issues
// https://tiptap.dev/docs/editor/extensions/functionality/color

// https://tiptap.dev/docs/editor/extensions/functionality/fontfamily
// https://tiptap.dev/docs/editor/extensions/marks/highlight
// https://tiptap.dev/docs/editor/extensions/nodes/table

// https://tiptap.dev/docs/editor/extensions/functionality/floatingmenu
// https://tiptap.dev/docs/editor/extensions/functionality/mathematics
// https://tiptap.dev/docs/editor/extensions/functionality/character-count
// https://tiptap.dev/docs/editor/extensions/functionality/placeholder
// https://tiptap.dev/docs/editor/extensions/functionality/uniqueid


// Pro Extensions:
// https://tiptap.dev/docs/editor/extensions/functionality/table-of-contents
// https://tiptap.dev/docs/editor/extensions/functionality/invisiblecharacters
// Consider this instead of mammothjs: https://tiptap.dev/docs/editor/extensions/functionality/import


import ImageExtended from "./extensions/ImageExtended.ts"
import { FontSize } from "./extensions/FontSize"
import CustomMark from "./extensions/CustomMark.ts"
import { fixTipTapContent } from "./HTMLFixer"

import EditorToolbar from "./EditorToolbar.js"
import { customComponents, customComponentsNodes } from "./custom-nodes/CustomNodes"


import "./editor-styles.scss"


interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget & { files: FileList | null };
}

const DocxEditor: React.FC = () => {
    const editor = useEditor( {
        extensions: [
            StarterKit.configure( {
                codeBlock: false,
            } ),

            Underline,
            TextStyle, Color, FontSize, FontFamily,
            Typography, Subscript, Superscript,


            TextAlign.configure( {
                types: ["heading", "paragraph"],
            } ),

            TaskList,
            TaskItem.configure( {
                nested: true,
            } ),

            ListKeymap,

            CodeBlockLowlight.configure( {
                lowlight,
            } ),

            Link.configure( {
                openOnClick     : false,
                autolink        : true,
                protocols       : ["ftp", "mailto"],
                defaultProtocol : "https",
                // validate: (href) => /^https?:\/\//.test(href), // only autolink urls with a protocol
            } ),

            Youtube.configure( {
                controls : false,
                nocookie : true,
            } ),

            CustomMark, ImageExtended,
            ...customComponentsNodes],
        content: "<p>Hello World!</p>",
    } )


    const fileInputRef = useRef<HTMLInputElement>( null )

    const readFileAsArrayBuffer = ( file: File ): Promise<ArrayBuffer> => {
        return new Promise<ArrayBuffer>( ( resolve, reject ) => {
            const reader = new FileReader()

            reader.onload = () => {
                if ( reader.result instanceof ArrayBuffer ) {
                    resolve( reader.result )
                } else {
                    reject( new Error( "Failed to read file as ArrayBuffer" ) )
                }
            }

            reader.onerror = () => {
                reject( reader.error )
            }

            reader.readAsArrayBuffer( file )
        } )
    }

    const handleDocxFile = ( arrayBuffer: ArrayBuffer ) => {
        const transformElement = ( element: any ) => {
            console.log( element )

            if ( element.children ) {
                const children = element.children.map( transformElement )
                element = { ...element, children: children }
            }

            const defaultFontSize = 12
            if ( element.type === "run" ) {
                // Add a FontSizeN styleId and styleName to all runs in the document,
                // so that we can use them in the styleMap below to properly import font sizes into tiptap
                const fontSize = element.fontSize ?? defaultFontSize
                element = {
                    ...element,
                    styleId   : `FontSize${fontSize}`,
                    styleName : `FontSize${fontSize}`
                }
            }

            return element
        }

        // Generate style maps for FontSizes 0-48
        // Could alternatively use the styleId format: // "r.FontSize48 => span[style='font-size: 48pt;']:fresh"
        const fontSizeStyleMaps =
            Array
                .from( Array( 49 ).keys() )
                .map( value => `r[style-name='FontSize${value}'] => span[style='font-size: ${value}pt;']:fresh` )

        const mammothStyleMap = [
            "u => u",
            ...fontSizeStyleMaps
        ]
        const mammothOptions = {
            styleMap              : mammothStyleMap,
            ignoreEmptyParagraphs : false,
            transformDocument     : transformElement
        }

        mammoth
            .convertToHtml( { arrayBuffer }, mammothOptions )
            .then( ( result ) => {
                const fixedHTML = fixTipTapContent( result.value )
                // console.log(result)
                // console.log(fixedHTML)

                editor?.commands.setContent( fixedHTML, true, {
                    preserveWhitespace: "full",
                } )
            } )
            .catch( ( err ) => console.error( err ) )

    }

    const handleFileChange = async ( event: FileInputEvent ) => {
        const file = event.target.files?.[0]

        if ( !file || !editor )
            return

        const arrayBuffer = await readFileAsArrayBuffer( file )

        if ( file.name.endsWith( ".docx" ) ) {
            handleDocxFile( arrayBuffer )
        }

        if ( file.name.endsWith( ".html" ) ) {
            const decoder = new TextDecoder( "utf-8" )
            const htmlString = decoder.decode( arrayBuffer )
            editor.commands.setContent( htmlString, true )
        }
    }

    const saveContentToFile = () => {
        if ( !editor )
            return

        const htmlContent = editor.getHTML()
        const blob = new Blob( [htmlContent], { type: "text/html" } )
        const url = URL.createObjectURL( blob )

        const a = document.createElement( "a" )
        a.href = url
        a.download = "content.html"
        document.body.appendChild( a )
        a.click()

        document.body.removeChild( a )
        URL.revokeObjectURL( url )
    }


    return (
        <div className="editor-wrapper">
            <input
                type="file" id="upload" accept=".docx,.html"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button onClick={saveContentToFile}>Save as HTML</button>
            {editor && <EditorToolbar editor={editor} customComponents={customComponents} />}
            <EditorContent editor={editor} />
        </div>
    )
}

export default DocxEditor