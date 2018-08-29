import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import {connect} from 'react-redux';
import {actions} from './actions';
import Groups from './Groups';
import {getStackEditing, getGroupEditing} from '../stacks/selectors';
import {getStackEditingServers} from '../servers/selectors';

const handlers = withHandlers({
  saveGroup: props => ({group, name, servers}, {resetForm, setErrors}) => {
    const {stack, updateGroup, editGroup, addGroup} = props;
    if (group.id) {
      const currentServers = group.serverIds ? group.serverIds.join(',') : null;
      if (name !== group.name || servers.join(',') !== currentServers) {
        updateGroup(
          {slug: stack.slug, groupId: group.id, name, serverIds: servers},
          {resetForm, setErrors}
        );
      }
      else editGroup({group: null});
    }
    else addGroup({slug: stack.slug, name, serverIds: servers}, {resetForm, setErrors});
  },

  removeGroup: ({removeGroup, stack}) => group => {
    removeGroup({slug: stack.slug, group});
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

const GroupsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  handlers
)(Groups);

export default GroupsContainer;
