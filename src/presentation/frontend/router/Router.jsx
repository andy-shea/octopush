import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getPage} from './selectors';
import App from '../App';
import {types} from './routes';
import Deploy from '../deploys/Deploy';
import LoginContainer from '../users/LoginContainer';
import NotFound from '../errors/NotFound';

const pageComponents = {
  deploy: Deploy,
  login: LoginContainer,
  notfound: NotFound
};

function Router({page, location: {type}}) {
  const Component = pageComponents[page];
  if (type === types.LOGIN) return <Component/>;
  return <App><Component/></App>;
}

Router.propTypes = {
  page: PropTypes.string.isRequired,
  location: PropTypes.shape({
    type: PropTypes.string.isRequired
  }).isRequired
};

export default connect(state => ({page: getPage(state), location: state.location}))(Router);
