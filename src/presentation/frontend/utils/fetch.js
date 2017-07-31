import withDefaults from 'ftchr';

const defaults = {
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

export const {get, post, put, patch, del} = withDefaults(defaults, response => response.contents);
