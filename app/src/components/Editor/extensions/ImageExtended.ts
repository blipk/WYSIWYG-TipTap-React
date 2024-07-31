import Image from "@tiptap/extension-image"
import { Plugin, PluginKey } from "prosemirror-state"
import { EditorView } from "prosemirror-view"


// This extends the tiptap Image plugin to allow drag and drop of images onto the editor
// Converted to typescript from here: https://github.com/ueberdosis/tiptap/issues/2912#issuecomment-1169631614

// I have also added the configuraiton option to support base64 images

// Define the ImageExtended type
const ImageExtended = Image.extend( {
    addProseMirrorPlugins() {
        return [
            new Plugin( {
                key   : new PluginKey( "imageDropPastePlugin" ),
                props : {
                    handleDOMEvents: {
                        drop( view: EditorView, event: DragEvent ) {
                            console.log( "TEST" )
                            const hasFiles =
                                event.dataTransfer &&
                                event.dataTransfer.files &&
                                event.dataTransfer.files.length > 0

                            if ( !hasFiles ) {
                                return false
                            }

                            const images = Array.from( event.dataTransfer.files ).filter( file =>
                                /image/i.test( file.type )
                            )

                            if ( images.length === 0 ) {
                                return false
                            }

                            event.preventDefault()

                            const { schema } = view.state
                            const coordinates = view.posAtCoords( {
                                left : event.clientX,
                                top  : event.clientY,
                            } )

                            if ( !coordinates ) {
                                return false
                            }

                            images.forEach( image => {
                                const reader = new FileReader()

                                reader.onload = readerEvent => {
                                    const result = readerEvent.target?.result as string
                                    const node = schema.nodes.image.create( {
                                        src: result,
                                    } )

                                    const transaction = view.state.tr.insert( coordinates.pos, node )
                                    view.dispatch( transaction )
                                }

                                reader.readAsDataURL( image )
                            } )

                            return true
                        },
                        paste( view: EditorView, event: ClipboardEvent ) {
                            const hasFiles =
                                event.clipboardData &&
                                event.clipboardData.files &&
                                event.clipboardData.files.length > 0

                            if ( !hasFiles ) {
                                return false
                            }

                            const images = Array.from( event.clipboardData.files ).filter( file =>
                                /image/i.test( file.type )
                            )

                            if ( images.length === 0 ) {
                                return false
                            }

                            event.preventDefault()

                            const { schema } = view.state

                            images.forEach( image => {
                                const reader = new FileReader()

                                reader.onload = readerEvent => {
                                    const result = readerEvent.target?.result as string
                                    const node = schema.nodes.image.create( {
                                        src: result,
                                    } )

                                    const transaction = view.state.tr.replaceSelectionWith( node )
                                    view.dispatch( transaction )
                                }

                                reader.readAsDataURL( image )
                            } )

                            return true
                        },
                    },
                },
            } ),
        ]
    },
} ).configure( {
    allowBase64 : true,
    inline      : true,
} )

export default ImageExtended