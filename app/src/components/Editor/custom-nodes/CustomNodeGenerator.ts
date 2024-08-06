import { ComponentType } from "react"
import { ReactNodeViewRenderer, Node, mergeAttributes, NodeConfig, Editor } from "@tiptap/react"
import { Node as ProseMirrorNode } from "prosemirror-model"


// These are the extra props passed to components that are customised into tiptap
interface TipTapProps {
    node?: ProseMirrorNode;
    extension?: NodeConfig;

    decorations?: any;
    deleteNode?: Function;
    editor?: Editor;
    getPos?: Function;
    selected?: boolean;
    updateAttributes?: Function;
}


interface ComponentConfig<P = any> {
    name: string;
    component: ComponentType<P>;
    inputProps: Record<string, "text" | "number">; // TODO: find a way to introspect this from the component
}

const propsAttributeHelper = ( props: Record<any, any> ) => {
    // This is a helper function that has to be used on any of the react components
    // It helps properly gather the props from HTML attributes (Viewer or loading content in Editor),
    // or ProseMirror attrs (inserting content in Editor)

    // It merges all the prop sources and returns them to the component properly

    // Usage example for the FlashCard component:
    //     const { title, content, alternateContent } = propsAttributeHelper(props)

    const extendedProps = {
        // regular props
        ...props,
        // props from the ProseMirror attrs when in the Tiptap Editor
        ...( props.node?.attrs || {} ),
        // props from the data-input-props HTML attribute,
        // this will override HTML attributes in the viewer,
        // which solves the case sensitivty problem
        ...( props["data-input-props"] && JSON.parse( props["data-input-props"] ) || {} )
    }
    return extendedProps
}

// This function takes a list of components in the spec above and generates tiptap nodes for each of them
// The `name` field is the name recognised by tiptap
// The `component` field is the reference to the component code,
//  its JSX must be wrapped in <NodeViewWrapper className="custom-component"></NodeViewWrapper>
// The `inputProps` records is used in ComponentPropsModal.tsx to gather props from HTML inputs and then
//  they will be passed to the component as ProseMirror attrs in the tiptap props,
//  HTML attributes and as a data-input-props attribute (for the Viewer)

function generateCustomNodes<P>( components: ComponentConfig<P>[] ) {
    return components.map( ( { name, component, inputProps } ) =>
        Node.create( {
            name,

            group: "block",

            atom: true,

            addAttributes() {
                console.log( "addAttributes", inputProps )
                console.log( this.options )
                return {
                    ...inputProps,
                    dataInputProps: {
                        default   : null,
                        parseHTML : ( element: HTMLElement ) => {
                            const data = element.getAttribute( "data-input-props" )
                            return data ? JSON.parse( data ) : {}
                        },
                        renderHTML: ( attributes: any ) => {
                            const { ...otherAttrs } = attributes
                            return { "data-input-props": JSON.stringify( otherAttrs ) }
                        },
                    },
                }
            },

            parseHTML() {
                return [
                    {
                        tag: name,
                    },
                ]
            },

            renderHTML( { HTMLAttributes } ) {
                return [name, mergeAttributes( HTMLAttributes )]
            },

            addNodeView() {
                return ReactNodeViewRenderer( component )
            },
        } )
    )
};

export { generateCustomNodes, propsAttributeHelper }
export type { ComponentConfig, TipTapProps }