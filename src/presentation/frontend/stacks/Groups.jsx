import React from 'react';
import PropTypes from 'prop-types';
import SaveGroupForm from './SaveGroupForm';
import GroupRow from './GroupRow';
import SettingsPaneContent from '../ui/menu/SettingsPaneContent';

function Groups({servers, stack: {groups}, editGroup, removeGroup, saveGroup, groupEditing}) {
  return (
    <React.Fragment>
      <h3>Server Groups</h3>
      <SettingsPaneContent>
        <SaveGroupForm servers={servers} saveGroup={saveGroup} group={groupEditing || {name: ''}}/>
        <ul>
          {groups && groups.sort((thisGroup, thatGroup) => thisGroup.id - thatGroup.id).map(group => (
            <GroupRow key={group.id} servers={group.servers.map(id => servers[id])} editGroup={editGroup} removeGroup={removeGroup} group={group}/>
          ))}
        </ul>
      </SettingsPaneContent>
    </React.Fragment>
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

export default Groups;
