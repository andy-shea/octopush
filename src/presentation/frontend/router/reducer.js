import {NOT_FOUND} from 'redux-first-router';
import {types} from './routes';

const components = {
  [types.STACK]: 'deploy',
  [types.LOGIN]: 'login',
  [NOT_FOUND]: 'notfound'
};

function reducer(state = components[types.STACK], action = {}) {
  return components[action.type] || state;
}

export default reducer;
