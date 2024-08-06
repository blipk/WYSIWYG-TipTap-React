#!/usr/bin/env bash

# Browser CSRF Protection blocks fetch to local files these days so we have to run the static page like this
# Alternatively we could include the bundled CSS and JS directly in the HTML, but please don't

python3 -m http.server &
xdg-open "http://localhost:8000/viewer_page.html?sourcePage=content_test.html"