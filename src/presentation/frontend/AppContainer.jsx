import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import {asyncConnect} from 'redux-connect';
import Layout from './ui/Layout';
import {shouldLoadStacks} from './stacks/selectors';
import {isAuthenticated} from './users/selectors';
import {actions as stackActions} from './stacks/actions';
import {actions as serverActions} from './servers/actions';

const asyncItems = [{
  promise: ({store: {getState, dispatch}, helpers = {}}) => {
    if (shouldLoadStacks(getState())) {
      return Promise.all([
        dispatch(stackActions.loadStacks(helpers)),
        dispatch(serverActions.loadServers(helpers))
      ]);
    }
  }
}];

@asyncConnect(asyncItems, state => ({authenticated: isAuthenticated(state)}))
class AppContainer extends Component {

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    stacks: PropTypes.object,
    servers: PropTypes.object
  }

  render() {
    const {authenticated, children} = this.props;
    return (
      <Layout isAuthenticated={authenticated}>
        {children}
      </Layout>
    );
  }

}

export default AppContainer;
