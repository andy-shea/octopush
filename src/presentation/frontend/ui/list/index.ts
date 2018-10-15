import {css} from 'styled-components';

export function middleable({middle}: {middle?: boolean}) {
  if (middle) {
    return css`
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    `;
  }
  return undefined;
}

// TODO: is this necessary?
export function newlineable({newline}: {newline?: boolean}) {
  if (newline) {
    return css`
      display: block;
    `;
  }
  return undefined;
}
