import fs from 'fs';
import glob from 'glob';
import serialize from 'serialize-javascript';
import {HttpError} from 'react-cornerstone/server';
import cx from 'classnames';
import {includeChunkManifest, includeAsset} from './assets';
import icons from './ui/icons.svg';
import styles from './ui/Header.css';
import loginStyles from './users/Login.css';
import logo from './ui/octopus.png';
import appleTouchIcon from './ui/favicons/apple-touch-icon.png';
import favicon16 from './ui/favicons/favicon-16x16.png';
import favicon32 from './ui/favicons/favicon-32x32.png';
import manifest from './ui/favicons/manifest.json';
import safariPinnedTab from './ui/favicons/safari-pinned-tab.svg';
import './ui/favicons/android-chrome-192x192.png';
import './ui/favicons/android-chrome-512x512.png';
import './ui/favicons/browserconfig.xml';
import './ui/favicons/favicon.ico';
import './ui/favicons/mstile-70x70.png';
import './ui/favicons/mstile-144x144.png';
import './ui/favicons/mstile-150x150.png';
import './ui/favicons/mstile-310x150.png';
import './ui/favicons/mstile-310x310.png';

let webpackLoader = '';
if (process.env.NODE_ENV === 'production') {
  webpackLoader = fs.readFileSync(glob.sync('./dist/web/runtime.*.js').pop(), 'utf8');
}

function renderLayout(body) {
  return `
<!doctype html>
<html>
<head>
  <title>Octopush</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <link href='//fonts.googleapis.com/css?family=Inconsolata:400,700|Source+Sans+Pro:300,400,700,400italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="/${includeAsset('main.css')}">
  <link rel="apple-touch-icon" sizes="180x180" href="${appleTouchIcon}">
  <link rel="icon" type="image/png" href="${favicon32}" sizes="32x32">
  <link rel="icon" type="image/png" href="${favicon16}" sizes="16x16">
  <link rel="manifest" href="${manifest}">
  <link rel="mask-icon" href="${safariPinnedTab}" color="#5bbad5">
  <meta name="theme-color" content="#ffffff">
  ${includeChunkManifest()}
</head>
<body>
  ${body}
</body>
</html>
  `;
}

export function render(html, state) {
  return renderLayout(`
${icons}
<div id="app">${html}</div>
<script>
  ${webpackLoader}
  window.__INITIAL_STATE__ = ${serialize(state, {isJSON: true})};
</script>
<script src="/${includeAsset('vendors.js')}"></script>
<script src="/socket.io/socket.io.js"></script>
<script src="/${includeAsset('main.js')}"></script>
  `);
}

export function renderError(code, err) {
  const title = (code === HttpError.NOT_FOUND) ?
      'Sorry, that page has gone walkabout' :
      'Sorry, something totally unexpected has happened';
  const message = (code === HttpError.NOT_FOUND) ?
      "We can't seem to find the page you're looking for" :
      "We're not entirely sure what happened, but rest assured we are looking into it";
  return renderLayout(`
<div class="${loginStyles.root}">
  <header class="${cx(styles.root, 'clearfix', loginStyles.header, styles.centre)}">
    <h1 class="ir" style="background-image:url(${logo});">Octopush</h1>
    <div class="${styles.content}">
      <h2>${title}</h2>
      <pre>${process.env.NODE_ENV === 'development' ? err.stack : message}</pre>
    </div>
  </header>
</div>
  `);
}
