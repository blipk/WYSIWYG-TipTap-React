import React, { useEffect, useRef } from "react"

import { customComponents } from "../Editor/custom-nodes/CustomNodes"
import { ComponentConfig } from "../Editor/custom-nodes/CustomNodeGenerator"

import { v4 as uuidv4 } from "uuid"

import root from "../../main"

const convertAttributeName = ( name: string ): string => {
    switch ( name ) {
    case "class":
        return "className"
    case "for":
        return "htmlFor"
    default:
        return name
    }
}

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
            const attrName = convertAttributeName( attr.name )
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
        const allElements = contentRef.current!.querySelectorAll<HTMLElement>( "*" )
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
                jsxChildren.push( convertElementToJSX( element ) )
            }
        } )
        root.render( <div>{jsxChildren}</div> )


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
        <div ref={contentRef}></div>
    )
}

export default Viewer