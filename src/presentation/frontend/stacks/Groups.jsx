import React from 'react';
import PropTypes from 'prop-types';
import {withHandlers} from 'recompose';
import SaveGroupForm from './SaveGroupForm';
import GroupRow from './GroupRow';
import SettingsPaneContent from '../ui/menu/SettingsPaneContent';

const enhance = withHandlers({
  removeGroup: ({removeGroup, stack}) => group => {
    removeGroup({slug: stack.slug, group});
  }
});

function Groups({servers, stack: {groups}, editGroup, removeGroup, saveGroup, groupEditing}) {
  return (
    <>
      <h3>Server Groups</h3>
      <SettingsPaneContent>
        <SaveGroupForm servers={servers} saveGroup={saveGroup} group={groupEditing || {name: ''}} />
        <ul data-testid="groups">
          {groups &&
            groups
              .slice()
              .sort((thisGroup, thatGroup) => thisGroup.id - thatGroup.id)
              .map(group => (
                <GroupRow
                  key={group.id}
                  servers={group.servers.map(id => servers[id])}
                  editGroup={editGroup}
                  removeGroup={removeGroup}
                  group={group}
                />
              ))}
        </ul>
      </SettingsPaneContent>
    </>
  );
}

Groups.propTypes = {
  servers: PropTypes.object.isRequired,
  editGroup: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
  stack: PropTypes.shape({
    groups: PropTypes.array
  }),
  groupEditing: PropTypes.object
};

export default enhance(Groups);
