## Run on localhost

Run `npm run start` the app in development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Usage & Tutorial

### General Information

- Custom theming: `https://www.tumblr.com/docs/de/custom_themes` doesn't seem to work.
- Tumblr Editor doesn't recognize template variables including ':' symbols (e.g. {block:ifMetaTag} won't work).
- Usage of the Tumblr API V2: `https://www.tumblr.com/docs/en/api/v2` is necessary.

Create your environment files to declare global variables:

```
REACT_APP_API_KEY=YOUR_TUMBLR_API_KEY
REACT_APP_API_URL=https://api.tumblr.com/v2/blog/YOUR_TUMBLR_URL
```

- .env.development (used with `npm run start` in development mode)
- .env.production (used with `npm run build` for a production build)

### Routing

Common Tumblr endpoints are used with _react-router-dom_ in this project:

- /page/:pageNumber
- /post/:postId
- /post/:postId/:caption
- /tagged/:tag
- /tagged/:tag/page/:pageNumber

Parameters get extracted and will fetch the according posts.

## Deployment on Tumblr

- Run `npm run build` to build a production build
- Move `<script defer="defer" src="/static/js/main.xxx.js"></script>` from `<head>` to the end of the `<body>` tag to prevent `Error: Minified React error #200;`
- Run `npm run inline` to inline _index.html_ that creates an _inline.html_ for deployment
- Copy the complete content from _build/inline.html_ and paste it into the Tumblr Editor
- Preview in Tumblr Editor might be unavailable
