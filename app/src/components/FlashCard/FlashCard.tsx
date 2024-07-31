import React, { useState } from "react"
import DOMPurify from "dompurify"
import Markdown from "react-markdown"
import "./FlashCard.css"
import { NodeViewWrapper } from "@tiptap/react"
import { TipTapProps } from "../Editor/custom-nodes/CustomNodeGenerator"


interface FlashCardProps {
    title: string;
    content: string;
    alternateContent: string;
}

type ExtendedCardProps = FlashCardProps & TipTapProps

const FlashCard: React.FC<ExtendedCardProps> = ( props ) => {
    const [flipped, setFlipped] = useState<boolean>( false )

    // Merge the prosemirror node attributes from the tiptap props with the component props,
    // in order to pass props as attributes when inserting the component into the tiptap editor
    const extendedProps = {...props, ...( props.node?.attrs || {} )}
    const { title, content, alternateContent } = extendedProps


    const handleCardClick = () => {
        setFlipped( !flipped )
    }

    const sanitizedContent = DOMPurify.sanitize( content )
    const sanitizedAlternateContent = DOMPurify.sanitize( alternateContent )

    return (
        <NodeViewWrapper className="custom-component">
            <div className={`flash-card ${flipped ? "flipped" : ""}`} onClick={handleCardClick}>
                <div className="card-inner">
                    {/* <div className="card-face card-front" dangerouslySetInnerHTML={{ __html: sanitizedContent }}> */}
                    <div className="card-face card-front">
                        <h2>{title}</h2>
                        <Markdown>{sanitizedContent}</Markdown>
                    </div>
                    <div className="card-face card-back">
                        <h2>{title}</h2>
                        <Markdown>{sanitizedAlternateContent}</Markdown>
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    )
}



export default FlashCard
export type { FlashCardProps as CardProps }