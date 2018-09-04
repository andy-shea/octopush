import {css} from 'styled-components';

export function middleable({middle}) {
  if (middle) {
    return css`
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    `;
  }
}

// TODO: is this necessary?
export function newlineable({newline}) {
  if (newline) {
    return css`
      display: block;
    `;
  }
}
