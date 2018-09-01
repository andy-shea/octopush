import {connect} from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import {actions} from './actions';
import {getIsAuthenticated, getRedirectPath} from './selectors';
import Login from './Login';

function mapStateToProps(state) {
  return {
    isAuthenticated: getIsAuthenticated(state),
    redirectPath: getRedirectPath(state),
    routesMap: state.location.routesMap
  };
}

function componentWillReceiveProps({isAuthenticated, redirectAfterLogin, redirectPath, routesMap}) {
  if (isAuthenticated) redirectAfterLogin(redirectPath, routesMap);
}

const enhance = compose(
  connect(
    mapStateToProps,
    actions
  ),
  lifecycle({componentWillReceiveProps})
);

const LoginContainer = enhance(Login);

export default LoginContainer;
