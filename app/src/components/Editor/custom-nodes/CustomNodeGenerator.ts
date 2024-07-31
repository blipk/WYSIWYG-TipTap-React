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

// This function takes a list of components in the spec above and generates tiptap nodes for each of them
// The `name` field is the name recognised by tiptap
// The `component` field is the reference to the component code,
//  its JSX must be wrapped in <NodeViewWrapper className="custom-component"></NodeViewWrapper>

// The `inputProps` records is used in ComponentPropsModal.tsx to gather props from HTML inputs and then
//  they will be passed to the component as prose mirror attributes in the tiptap props
//     e.g. for the FlashCard component:
///     const extendedProps = {...props, ...(props.node?.attrs || {})}
///     const { title, content, alternateContent } = extendedProps


function generateCustomNodes<P>( components: ComponentConfig<P>[] ) {
    return components.map( ( { name, component, inputProps } ) =>
        Node.create( {
            name,

            group: "block",

            atom: true,

            addAttributes() {
                return inputProps
            },

            parseHTML() {
                return [
                    {
                        tag: name,
                    },
                ]
            },

            renderHTML( { HTMLAttributes } ) {
                return [name, mergeAttributes( this.options.HTMLAttributes, HTMLAttributes )]
            },

            addNodeView() {
                return ReactNodeViewRenderer( component )
            },
        } )
    )
};

export { generateCustomNodes }
export type { ComponentConfig, TipTapProps }