import React, {Component} from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {actions} from './actions';
import Groups from './Groups';
import {getStackEditing} from '../stacks/selectors';
import {getStackEditingServers} from '../servers/selectors';

const mapDispatchToProps = {
  updateGroup: actions.updateGroup,
  removeGroup: actions.removeGroup,
  addGroup: actions.addGroup
};

function mapStateToProps(state) {
  return {
    stack: getStackEditing(state),
    servers: getStackEditingServers(state)
  };
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class GroupsContainer extends Component {

  state = {};

  @autobind
  editGroup(group) {
    this.setState({groupEditing: group});
  }

  @autobind
  saveGroup({group, name, servers}, {resetForm, setErrors}) {
    const {stack, updateGroup, addGroup} = this.props;
    if (group.id) {
      const currentServers = group.serverIds ? group.serverIds.join(',') : null;
      if (name !== group.name || servers.join(',') !== currentServers) {
        updateGroup(
          {slug: stack.slug, groupId: group.id, name, serverIds: servers},
          {onSuccess: this.editGroup, setErrors}
        );
      }
      else this.editGroup(null);
    }
    else {
      addGroup({slug: stack.slug, name, serverIds: servers}, {onSuccess: resetForm, setErrors});
    }
  }

  render() {
    const {stack, removeGroup, servers} = this.props;
    return (
      <Groups
        saveGroup={this.saveGroup}
        editGroup={this.editGroup}
        removeGroup={removeGroup}
        stack={stack}
        servers={servers}
        groupEditing={this.state.groupEditing}
      />
    );
  }

}

export default GroupsContainer;
