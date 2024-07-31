// Toolbar.tsx
import React, { useState } from "react"
import { Editor } from "@tiptap/react"
import { Node as ProseMirrorNode } from "prosemirror-model"

import { Level } from "@tiptap/extension-heading"

import { ComponentConfig } from "./custom-nodes/CustomNodeGenerator"
import ComponentPropsModal from "./ComponentPropsModal"
import {
    LucideProps, LucideIcon,
    Bold, Italic, Underline, Strikethrough, Pilcrow,
    Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    ListOrdered, List, ListCheck, Quote, Code,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Subscript, Superscript,
    Video,
} from "lucide-react"


interface ToolbarProps {
    editor: Editor;
    customComponents: ComponentConfig[];
}

// Nice toolbar example: https://github.com/ueberdosis/tiptap/issues/388


type IconButtonProps = {
    icon?: LucideIcon;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<IconButtonProps> = ( { icon: IconComponent, children, ...props } ) => {
    const iconProps = {
        size: 48,
    }
    const newProps = { ...props, ...{ icon: null } }
    newProps.className += " icon-button"

    return (
        <button {...newProps}>
            {IconComponent && <IconComponent {...iconProps} />}
            {children}
        </button>
    )
}


const EditorToolbar: React.FC<ToolbarProps> = ( { editor, customComponents } ) => {
    const iconProps = {
        size: 48,
    }



    const [isModalOpen, setModalOpen] = useState( false )
    const [currentComponent, setCurrentComponent] = useState<ComponentConfig | null>( null )

    const [selectedFontSize, setSelectedFontSize] = useState( "0" )
    // const [selectedHeadingLevel, setSelectedHeadingLevel] = useState( "0" )


    if ( !editor )
        return null

    const handleModalSubmit = ( values: Record<string, any> ) => {
        if ( !currentComponent ) return
        editor.chain().focus().insertContent( { type: currentComponent.name, attrs: values } ).run()
        setCurrentComponent( null )
    }

    // const changeFontSizeDelta = ( delta: number ) => {
    //     const { from, to } = editor.state.selection

    //     let currentFontSize = 16
    //     editor.state.doc.nodesBetween( from, to, ( node ) => {
    //         if ( node.marks ) {
    //             node.marks.forEach( ( mark ) => {
    //                 if ( mark.type.name === "textStyle" && mark.attrs.fontSize ) {
    //                     currentFontSize = parseInt( mark.attrs.fontSize, 10 )
    //                 }
    //             } )
    //         }
    //     } )

    //     const newFontSize = currentFontSize + delta
    //     changeFontSize( newFontSize )
    // }

    const setFontSize = ( fontSize: number ) => {
        editor.chain().focus().setFontSize( `${fontSize}pt` ).run()
    }

    const headingComponents: Record<number, React.ComponentType<LucideProps>> = {
        1 : Heading1,
        2 : Heading2,
        3 : Heading3,
        4 : Heading4,
        5 : Heading5,
        6 : Heading6,
    }
    const setHeadingLevel = ( headingLevel: Level ) => {
        editor.chain().focus().toggleHeading( { level: headingLevel } ).run()
    }

    const textAlignValues = ["left", "center", "right", "justify"]
    const textAlignComponents: Record<string, React.ComponentType<LucideProps>> = {
        "left"    : AlignLeft,
        "center"  : AlignCenter,
        "right"   : AlignRight,
        "justify" : AlignJustify,
    }
    const setTextAlign = ( textAlign: string ) => {
        editor.chain().focus().setTextAlign( textAlign ).run()
    }

    const convertToPlainText = () => {
        const { state, commands: _commands } = editor
        const { tr, selection, schema } = state
        const { from, to } = selection

        // Collect changes in an array of {from, to, node} objects
        const changes: { from: number; to: number; node: ProseMirrorNode | null }[] = []

        state.doc.nodesBetween( from, to, ( node, pos ) => {
            if ( node.isTextblock ) {
                // Extract text content and trim it to remove unnecessary whitespace
                const textContent = node.textContent.trim()

                // Only create a new node if there's text content
                if ( textContent ) {
                    const plainTextNode = schema.nodes.paragraph.create( null, schema.text( textContent ) )
                    changes.push( { from: pos, to: pos + node.nodeSize, node: plainTextNode } )
                } else {
                    // If the node is empty, remove it
                    changes.push( { from: pos, to: pos + node.nodeSize, node: null } )
                }
            }
        } )

        // Apply changes in a single transaction
        changes.reverse().forEach( change => {
            if ( change.node ) {
                tr.replaceWith( change.from, change.to, change.node )
            } else {
                tr.delete( change.from, change.to )
            }
        } )

        editor.view.dispatch( tr )
    }

    const addYoutubeVideo = ( width = 640, height = 480 ) => {
        const url = prompt( "Enter YouTube URL" )

        if ( url ) {
            editor.commands.setYoutubeVideo( {
                src    : url,
                width  : Math.max( 1920, width ),
                height : Math.max( 1080, height ),
            } )
        }
    }

    return (
        <div className="toolbar">
            <div className="toolbar-row">
                <IconButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive( "bold" ) ? "is-active" : ""}
                    icon={Bold}
                >
                    {/* <Bold {...iconProps} /> */}
                </IconButton>
                <IconButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive( "italic" ) ? "is-active" : ""}
                >
                    <Italic {...iconProps} />
                </IconButton>
                <IconButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                    className={editor.isActive( "underline" ) ? "is-active" : ""}
                >
                    <Underline {...iconProps} />
                </IconButton>
                <IconButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={editor.isActive( "strike" ) ? "is-active" : ""}
                >
                    <Strikethrough {...iconProps} />
                </IconButton>

                <IconButton
                    onClick={() => convertToPlainText()}
                >
                    <Pilcrow {...iconProps} />
                </IconButton>

                {Array
                    .from( Array( 7 ).keys() )
                    .filter( v => v != 0 )
                    .map( level => {
                        const HeadingComponent = headingComponents[level]
                        return (
                            <IconButton
                                onClick={() => setHeadingLevel( level as Level )}
                                disabled={!editor.can().chain().focus().toggleHeading( { level: level as Level } ).run()}
                                className={editor.isActive( "heading", { level: level } ) ? "is-active" : ""}
                                key={`heading${level}-button`}
                            >
                                <HeadingComponent {...iconProps} />
                            </IconButton>
                        )
                    }
                    )}

                <IconButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={!editor.can().chain().focus().toggleBulletList().run()}
                    className={editor.isActive( "bulletList" ) ? "is-active" : ""}
                >
                    <List {...iconProps} />
                </IconButton>

                <IconButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                    className={editor.isActive( "orderedList" ) ? "is-active" : ""}
                >
                    <ListOrdered {...iconProps} />
                </IconButton>

                <IconButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    disabled={!editor.can().chain().focus().toggleTaskList().run()}
                    className={editor.isActive( "taskList" ) ? "is-active" : ""}
                >
                    <ListCheck {...iconProps} />
                </IconButton>

                <IconButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                    className={editor.isActive( "blockquote" ) ? "is-active" : ""}
                >
                    <Quote {...iconProps} />
                </IconButton>

                <IconButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive( "codeBlock" ) ? "is-active" : ""}
                >
                    <Code {...iconProps} />
                </IconButton>

                {textAlignValues.map( alignValue => {
                    const AlignComponent = textAlignComponents[alignValue]
                    return (
                        <IconButton
                            onClick={() => setTextAlign( alignValue )}
                            className={editor.isActive( { textAlign: alignValue } ) ? "is-active" : ""}
                            key={`textAlign${alignValue}-button`}

                        >
                            <AlignComponent {...iconProps} className="icon-button" />
                        </IconButton>
                    )
                } )}


                <IconButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={editor.isActive( "subscript" ) ? "is-active" : ""}
                    disabled={!editor.can().chain().focus().toggleSubscript().run()}
                    icon={Subscript}
                />
                <IconButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={editor.isActive( "superscript" ) ? "is-active" : ""}
                    disabled={!editor.can().chain().focus().toggleSuperscript().run()}
                    icon={Superscript}
                />



                {/* <select value={selectedHeadingLevel}
                    onChange={(e) => {
                        if (e.target.value === "0")
                            return
                        changeHeadingLevel(parseInt(e.target.value, 10) as Level)
                        setSelectedHeadingLevel("0")
                    }}>
                    <option key={0} value={0}>Set Selected Heading Level</option>
                    {Array.from(Array(7).keys()).filter(v => v != 0).map(v => <option key={v} value={v}>{v}</option>)}
                </select> */}

                {/* <button onClick={() => changeFontSizeDelta(1)}>Increase Font Size</button>
            <button onClick={() => changeFontSizeDelta(-1)}>Decrease Font Size</button> */}

                <select value={selectedFontSize}
                    onChange={( e ) => {
                        if ( e.target.value === "0" )
                            return
                        setFontSize( parseInt( e.target.value, 10 ) )
                        setSelectedFontSize( "0" )
                    }}>
                    <option key={0} value={0}>Set Selected Font Size&nbsp;&nbsp;&nbsp;&nbsp;</option>
                    {Array.from( Array( 49 ).keys() ).filter( v => v % 2 == 0 && v != 0 ).map( v => <option key={v} value={v}>{v}pt</option> )}
                </select>

            </div>

            <div className="toolbar-row">
                <IconButton id="add" onClick={_ => addYoutubeVideo( )}>
                    <Video {...iconProps} />
                </IconButton>

                {customComponents.map( ( customComponent ) => (
                    <button
                        key={customComponent.name}
                        onClick={() => {
                            setCurrentComponent( customComponent )
                            setModalOpen( true )
                        }}
                    >
                        Insert {customComponent.name}
                    </button>
                ) )}

                {currentComponent && (
                    <ComponentPropsModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen( false )}
                        onSubmit={handleModalSubmit}
                        componentConfig={currentComponent}
                    />
                )}
            </div>


        </div>
    )
}


export default EditorToolbar