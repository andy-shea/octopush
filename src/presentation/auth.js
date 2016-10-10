import {UserAuthWrapper} from 'redux-auth-wrapper';
import {getAuthenticatedUser} from './frontend/users/selectors';

export const RequiresAuth = UserAuthWrapper({
  authSelector: getAuthenticatedUser,
  wrapperDisplayName: 'RequiresAuth'
});

export const userDetailsExtractor = ({id, email, name}) => ({id, email, name});
