import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {routerActions} from 'react-router-redux';
import {actions} from './actions';
import {isAuthenticated, getFormState} from './selectors';
import Login from './Login';

function mapStateToProps(state, {location}) {
  return {
    authenticated: isAuthenticated(state),
    formState: getFormState(state),
    redirect: location.query.redirect || '/'
  };
}

@connect(mapStateToProps, {...actions, replace: routerActions.replace})
class LoginContainer extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    redirect: PropTypes.string.isRequired,
    formState: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    this.ensureNotLoggedIn(nextProps);
  }

  ensureNotLoggedIn(props) {
    const {authenticated, replace, redirect} = props;
    if (authenticated) replace(redirect);
  }

  render() {
    const {formState, login} = this.props;
    return <Login formState={formState} login={login}/>;
  }
}

export default LoginContainer;
