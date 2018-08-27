export function middleable({middle}) {
  if (middle) {
    return `
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    `;
  }
}

// TODO: is this necessary?
export function newlineable({newline}) {
  if (newline) {
    return `
      display: block;
    `;
  }
}
