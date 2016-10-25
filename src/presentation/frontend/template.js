import {HttpError} from 'react-cornerstone/server';
import icons from './ui/icons.svg';
import styles from './ui/Header.css';
import loginStyles from './users/Login.css';
import logo from './ui/octopus.png';

function renderLayout(body) {
  return `
<!doctype html>
<html>
<head>
  <title>Octopush</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <link href='//fonts.googleapis.com/css?family=Inconsolata:400,700|Source+Sans+Pro:300,400,700,400italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="/main.css">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/manifest.json">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="theme-color" content="#ffffff">
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
  window.__INITIAL_STATE__ = ${JSON.stringify(state)};
</script>
<script src="/vendors.js"></script>
<script src="/socket.io/socket.io.js"></script>
<script src="/main.js"></script>
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
<header class="${[styles.root, 'clearfix', loginStyles.header].join(' ')}">
  <h1 class="ir" style="background-image:url(${logo});">Octopush</h1>
  <div class="${styles.content}">
    <h2>${title}</h2>
    <pre>${process.env.NODE_ENV === 'development' ? err.stack : message}</pre>
  </div>
</header>
  `);
}
