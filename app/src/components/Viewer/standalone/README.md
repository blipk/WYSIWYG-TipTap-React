### Standalone Viewer

This is the standalone `Viewer` for content exported from the WYSIWYG Editor.

You can specify HTML to load via the query string URL parameters:
`?sourcePage=source_file.html` to fetch and load a URL/file
`?sourceHTML=<p>Hello</p>` to directly specify some HTML


### Building

Comment out all components in `App.tsx`,
then use the `build` script in package.json (`pnpm run build`),
and then copy the `index.css` and `index.js` to this directory.

Alternatively you could leave the `Editor` component in `App.tsx` and this will default to the editor if there's no HTML source specified.