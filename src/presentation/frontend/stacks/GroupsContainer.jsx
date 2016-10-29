import React, {Component, PropTypes} from 'react';
import autobind from 'autobind-decorator';
import {connect} from 'react-redux';
import {actions} from './actions';
import Groups from './Groups';
import {getStackEditing, getGroupEditing, getGroupMeta} from '../stacks/selectors';
import {getStackEditingServers} from '../servers/selectors';

const mapDispatchToProps = {
  editGroup: actions.editGroup,
  updateGroup: actions.updateGroup,
  removeGroup: actions.removeGroup,
  addGroup: actions.addGroup
};

function mapStateToProps(state) {
  return {
    stackEditing: getStackEditing(state),
    groupEditing: getGroupEditing(state),
    servers: getStackEditingServers(state),
    meta: getGroupMeta(state)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class GroupsContainer extends Component {

  static propTypes = {
    editGroup: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    removeGroup: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    stackEditing: PropTypes.object.isRequired,
    meta: PropTypes.object,
    groupEditing: PropTypes.object,
    servers: PropTypes.object
  }

  @autobind
  saveGroup(group, name, selectedServers) {
    const {stackEditing, updateGroup, editGroup, addGroup} = this.props;
    if (group.id) {
      const currentServers = group.serverIds ? group.serverIds.join(',') : null;
      if (name !== group.name || selectedServers !== currentServers) {
        updateGroup(stackEditing, group, name, selectedServers);
      }
      else editGroup(null);
    }
    else addGroup(stackEditing, name, selectedServers);
  }

  @autobind
  removeGroup(group) {
    this.props.removeGroup(this.props.stackEditing, group);
  }

  render() {
    const {meta, stackEditing, groupEditing, editGroup, servers} = this.props;
    return (
      <Groups meta={meta} servers={servers} groupEditing={groupEditing} groups={stackEditing.groups} editGroup={editGroup}
          removeGroup={this.removeGroup} saveGroup={this.saveGroup}/>
    );
  }
}

export default GroupsContainer;
