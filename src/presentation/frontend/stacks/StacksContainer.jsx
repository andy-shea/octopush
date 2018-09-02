import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {actions} from './actions';
import StackList from './StackList';
import StackDetail from './StackDetail';
import {getStacks, getStackEditing} from './selectors';
import {getServers} from '../servers/selectors';

function mapStateToProps(state) {
  return {
    stacks: getStacks(state),
    stackEditing: getStackEditing(state),
    servers: getServers(state)
  };
}

@connect(
  mapStateToProps,
  actions
)
class StacksContainer extends Component {

  static propTypes = {
    createStack: PropTypes.func.isRequired,
    editStack: PropTypes.func.isRequired,
    updateStack: PropTypes.func.isRequired,
    removeStack: PropTypes.func.isRequired,
    addStack: PropTypes.func.isRequired,
    stacks: PropTypes.object,
    stackEditing: PropTypes.object,
    servers: PropTypes.object
  };

  @autobind
  saveStack({stack, title, gitPath, servers, diff}, {setSubmitting, setErrors}) {
    const {updateStack, addStack} = this.props;
    if (stack.id) {
      const currentServers = stack.servers ? stack.servers.join(',') : null;
      if (
        title !== stack.title ||
        gitPath !== stack.gitPath ||
        diff !== stack.diff ||
        servers.join(',') !== currentServers
      ) {
        updateStack(
          {slug: stack.slug, title, gitPath, serverIds: servers, diff},
          {setSubmitting, setErrors}
        );
      }
      else setSubmitting(false);
    }
    else addStack({title, gitPath, serverIds: servers, diff}, {setSubmitting, setErrors});
  }

  render() {
    const {servers, stacks, stackEditing, createStack, editStack, removeStack} = this.props;
    return stackEditing ? (
      <StackDetail
        stack={stackEditing}
        servers={servers}
        saveStack={this.saveStack}
        editStack={editStack}
      />
    ) : (
      <StackList
        createStack={createStack}
        stacks={stacks}
        editStack={editStack}
        removeStack={removeStack}
      />
    );
  }

}

export default StacksContainer;
