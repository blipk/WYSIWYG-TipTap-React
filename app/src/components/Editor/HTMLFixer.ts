// TipTap/ProseMirror doesn't support img or other block elements inside inline elements like <p>
// unfortunately this is how mammothjs extracts them from a .docx file
// thus we have to fix them with this function first

// alternatively we could configure the Image plugin with `inline: true`,
// however this may cause other unintended problems,
// and this solution also fixes other issues

// Converted to TypeScript form here
// https://gist.github.com/johanobergman/ce9178b8669fc05fefd4aedaa93403d8


/**
 * Modifies legacy html to match TipTap document structure,
 * without losing content.
 *
 * Images in paragraphs, links with images inside,
 * links not in paragraphs and YouTube videos
 * are taken care of.
 *
 * Images are assumed to be configured as blocks in TipTap.
 */
export function fixTipTapContent( html: string ): string {
    const container: HTMLElement = document.createElement( "div" )
    container.innerHTML = html

    let el: Element | null

    // Move all images out of anchors, and set replacement text for the anchors.
    while ( ( el = container.querySelector( "a > img" ) ) ) {
        unwrapLink( el.parentNode as HTMLElement, el.getAttribute( "alt" ) || "Image link" )
    }

    // Move all images out of paragraphs.
    while ( ( el = container.querySelector( "p > img" ) ) ) {
        unwrap( el.parentNode as HTMLElement )
    }

    // Move all images out of spans.
    while ( ( el = container.querySelector( "span > img" ) ) ) {
        unwrap( el.parentNode as HTMLElement )
    }

    // Wrap all non-paragraph-wrapped anchors in paragraphs.
    while ( ( el = container.querySelector( "a:not(p a)" ) ) ) {
        wrap( el as HTMLElement, document.createElement( "p" ) )
    }

    // Move youtube iframes out of paragraphs.
    while ( ( el = container.querySelector( "p > iframe[src*=\"youtube.com\"]" ) ) ) {
        unwrap( el.parentNode as HTMLElement )
    }

    // Wrap youtube iframes in the proper tiptap-element.
    while ( ( el = container.querySelector( ":not([data-youtube-video]) > iframe[src*=\"youtube.com\"]" ) ) ) {
        const wrapper: HTMLElement = document.createElement( "div" )
        wrapper.dataset.youtubeVideo = "true"
        wrap( el as HTMLElement, wrapper )
    }

    return container.innerHTML
}

/**
 * Move all children out of an element, and remove the element.
 */
function unwrap( el: HTMLElement ): void {
    const parent: HTMLElement = el.parentNode as HTMLElement

    // Move all children to the parent element.
    while ( el.firstChild ) parent.insertBefore( el.firstChild, el )

    // Remove the empty element.
    parent.removeChild( el )
}

/**
 * Move all children out of an anchor, and set a replacement text.
 */
function unwrapLink( el: HTMLElement, replacementText: string ): void {
    const parent: HTMLElement = el.parentNode as HTMLElement

    // Move all children to the parent element.
    while ( el.firstChild ) parent.insertBefore( el.firstChild, el )

    // Keep the anchor in the dom but since it's empty we'll
    // set a replacement text.
    el.textContent = replacementText
}

/**
 * Wrap a DOM node with another node.
 */
function wrap( el: HTMLElement, wrapper: HTMLElement ): void {
    el.parentNode?.insertBefore( wrapper, el )
    wrapper.appendChild( el )
}