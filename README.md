## Run on localhost

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Usage & Tutorial

### General Information

Custom theming: `https://www.tumblr.com/docs/de/custom_themes` doesn't seem to work.<br />
Tumblr Editor doesn't recognize template variables including ':' (e.g. {block:ifMetaTag} won't work).<br />

Usage of the Tumblr API V2: `https://www.tumblr.com/docs/en/api/v2` is necessary. <br />

(optional) Usage of .env files to declare global variables:

```
REACT_APP_API_KEY=YOUR_TUMBLR_API_KEY
REACT_APP_API_URL=https://api.tumblr.com/v2/blog/YOUR_TUMBLR_LINK
```

### Prepare Pages and Endpoints

In order to use the typical Tumblr urls, you need to create routing and components for the following endpoints:

- /page/:pageNumber
- /post/:postId
- /post/:postId/:caption
- /tagged/:tag
- /tagged/:tag/page/:pageNumber

### Demo

This project shows a basic implementation of fetching tumblr posts.

## Deployment on Tumblr

Run `npm run build` to build a production build.

Run `npm run inline` to inline index.html.

Copy content from formatted _build/inline.html_ into Tumblr Editor.
Preview in Tumblr Editor might be unavailable.
