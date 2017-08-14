import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import {connect} from 'react-redux';
import {actions} from './actions';
import Groups from './Groups';
import {getStackEditing, getGroupEditing} from '../stacks/selectors';
import {getStackEditingServers} from '../servers/selectors';

const handlers = withHandlers({
  saveGroup: props => (group, name, selectedServers) => {
    const {stack, updateGroup, editGroup, addGroup} = props;
    if (group.id) {
      const currentServers = group.serverIds ? group.serverIds.join(',') : null;
      if (name !== group.name || selectedServers !== currentServers) {
        updateGroup({stack, group, name, serverIds: selectedServers});
      }
      else editGroup(null);
    }
    else addGroup({stack, name, serverIds: selectedServers});
  },

  removeGroup: ({removeGroup, stack}) => group => {
    removeGroup({stack, group});
  }
});

const mapDispatchToProps = {
  editGroup: actions.editGroup,
  updateGroup: actions.updateGroup,
  removeGroup: actions.removeGroup,
  addGroup: actions.addGroup
};

function mapStateToProps(state) {
  return {
    stack: getStackEditing(state),
    groupEditing: getGroupEditing(state),
    servers: getStackEditingServers(state)
  };
}

const GroupsContainer = compose(connect(mapStateToProps, mapDispatchToProps), handlers)(Groups);

export default GroupsContainer;
