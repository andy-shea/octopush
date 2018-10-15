import React, {SFC} from 'react';
import {injectGlobal} from 'styled-components';
import styledNormalize from 'styled-normalize';
import Icons from './icon/Icons';

// https://0p06jr8rql.codesandbox.io/
function reset() {
  return injectGlobal`
    ${styledNormalize};

    :root {
      --color-blue: #476380;
      --color-blue-10: #34495e;
      --color-blue-20: #2c3e50;
      --color-white: #fff;
      --color-grey: #ecf0f1;
      --color-grey-5: #dfe5e7;
      --color-grey-10: #d0dadc;
      --color-grey-15: #c1ced1;
      --color-grey-20: #b3c3c7;
      --color-grey-30: #95abb1;
      --color-green: #2ecc71;
      --color-light-red: #fce9e9;
      --color-red-highlight: #ea6262;
      --color-red: #e85657;
      --color-red-10: #e22828;
      --color-red-15: #d31d1d;
      --color-red-20: #bc1a1a;
      --color-red-25: #a61717;
      --color-red-35: #791111;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    html {
      font-size: 16px;
      background: var(--color-blue-10);
      color: var(--color-blue-10);
      width: 100%;
      height: 100%;
    }

    html,
    body,
    body > div {
      width: 100%;
      height: 100%;
    }

    html,
    body {
      overflow-x: hidden;
    }

    html,
    button,
    input,
    select,
    textarea {
      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-font-smoothing: antialiased;
      -ms-font-smoothing: antialiased;
      -o-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    ul,
    ol {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    input:focus,
    button:focus,
    textarea:focus {
      outline: none;
    }
  `;
}

const Reset: SFC = () => {
  reset();
  return <Icons />;
};

export default Reset;
