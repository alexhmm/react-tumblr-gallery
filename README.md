## Run on localhost

Run `npm run start` the app in development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Usage & Tutorial

### General Information

Custom theming: `https://www.tumblr.com/docs/de/custom_themes` doesn't seem to work.\
Tumblr Editor doesn't recognize template variables including ':' (e.g. {block:ifMetaTag} won't work).

Usage of the Tumblr API V2: `https://www.tumblr.com/docs/en/api/v2` is necessary.\

Create ab .env file to declare global variables:

```
REACT_APP_API_KEY=YOUR_TUMBLR_API_KEY
REACT_APP_API_URL=https://api.tumblr.com/v2/blog/YOUR_TUMBLR_URL
```

- .env (used with `npm run start` in development mode)
- .env.production (used with `npm run build` for production build)

### Routing

Typical Tumblr endpoints are used with _react-router-dom_ in this project:

- /page/:pageNumber
- /post/:postId
- /post/:postId/:caption
- /tagged/:tag
- /tagged/:tag/page/:pageNumber

Parameters get extracted and will fetch the according posts.

### Demo

This project shows a basic implementation of fetching tumblr posts.

## Deployment on Tumblr

Run `npm run build` to build a production build.

Run `npm run inline` to inline _index.html_ and create an _inline.html_.

Copy content from formatted _build/inline.html_ into Tumblr Editor.
Preview in Tumblr Editor might be unavailable.
