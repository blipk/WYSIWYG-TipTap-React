import React, { useEffect, useRef } from "react"

import { customComponents } from "../Editor/custom-nodes/CustomNodes"
import { ComponentConfig } from "../Editor/custom-nodes/CustomNodeGenerator"

import { v4 as uuidv4 } from "uuid"


import root from "../../main"

import "../Editor/editor-styles.scss"
import "./viewer-styles.scss"

import hljs from "highlight.js"
import "../../../node_modules/highlight.js/styles/vs2015.css"


// TODO: It would probably be a lot simpler and more consistent to just
// render this with the Tiptap editor with the `editable: false` option


const convertStyleStringToObject = ( styleString: string ): React.CSSProperties => {
    const styleObject: Record<string, string> = {}

    styleString.split( ";" ).forEach( styleProperty => {
        const [key, value] = styleProperty.split( ":" ).map( item => item.trim() )
        if ( key && value ) {
            const camelCaseKey = key.replace( /-([a-z])/g, g => g[1].toUpperCase() )
            styleObject[camelCaseKey] = value
        }
    } )

    return styleObject as React.CSSProperties
}

const convertElementToJSX = ( element: HTMLElement ): React.ReactNode => {
    const tagName: string = element.tagName.toLowerCase()

    // Extract attributes
    const attributes: Record<string, string> = Object.fromEntries(
        [...element.attributes].map( attr => {
            const attrName = attr.name.replace( "class", "className" ).replace( "for", "htmlFor" )
            if ( attrName === "style" )
                return [attrName, convertStyleStringToObject( attr.value )]
            return [attrName, attr.value]
        } )
    )

    // Convert children
    const children: React.ReactNode[] = Array.from( element.childNodes ).map( ( childNode ) => {
        if ( childNode.nodeType === Node.ELEMENT_NODE )
            return convertElementToJSX( childNode as HTMLElement )

        if ( childNode.nodeType === Node.TEXT_NODE )
            return childNode.textContent

        return null
    } )

    return React.createElement( tagName, { ...attributes, key: uuidv4() }, ...children )
}



interface ViewerProps {
    htmlContent: string;
}

const Viewer: React.FC<ViewerProps> = ( { htmlContent } ) => {
    const contentRef = useRef<HTMLDivElement | null>( null )

    useEffect( () => {
        if ( !contentRef.current )
            return

        contentRef.current.innerHTML = htmlContent

        // Replace custom component placeholders with actual React components
        const jsxChildren: React.ReactNode[] = []
        const allElements = document.querySelectorAll<HTMLElement>( "#viewerContainer > *" )
        allElements.forEach( ( element ) => {
            const thisCustomComponent: ComponentConfig | undefined
                = customComponents
                    .find( ( { name } ) => name.toLowerCase() === element.tagName.toLowerCase() )

            if ( thisCustomComponent ) {
                // convert the HTML attributes to props
                const props: Record<string, string> = Object.fromEntries(
                    [...element.attributes].map( attr => [attr.name, attr.value] )
                )

                const Component = thisCustomComponent.component
                jsxChildren.push( <Component {...props} key={uuidv4()} /> )
            } else {
                const blocks = element.querySelectorAll( "pre > code" )
                blocks.forEach( ( block ) => {
                    hljs.highlightElement( block as HTMLElement )
                } )
                jsxChildren.push( convertElementToJSX( element ) )
            }
        } )

        root.render( <div className={"tiptap ProseMirror"}>{jsxChildren}</div> )

        // This method is simpler however ReactDOM.render is deprecated and the app will behave as if it's on React v17
        // import ReactDOM from "react-dom"
        // customComponents.forEach( ( { name, component: Component }: ComponentConfig ) => {
        //     const customElements = contentRef.current!.querySelectorAll<HTMLElement>( name )

        //     customElements.forEach( ( element ) => {
        //         // convert the HTML attributes to props
        //         const props: Record<string, any> = {}
        //         for ( const attr of Array.from( element.attributes ) ) {
        //             props[attr.name] = attr.value
        //         }

        //         const componentNode: React.ReactNode = <Component {...props} />
        //         ReactDOM.render( componentNode, element )
        //     } )
        // } )

    }, [htmlContent] )

    return (
        // This actually isn't rendered as we're rendering into the root element above
        // Although it is used to gather all the elements and convert them appropriately
        <div id={"viewerContainer"} ref={contentRef}></div>
    )
}

export default Viewer