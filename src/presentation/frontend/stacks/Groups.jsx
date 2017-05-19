import React from 'react';
import PropTypes from 'prop-types';
import SaveGroupForm from './SaveGroupForm';
import GroupRow from './GroupRow';
import {settingsPaneContent} from '../ui/menu/Menu.css';

function Groups({formState, servers, groups, editGroup, removeGroup, saveGroup, groupEditing}) {
  return (
    <div>
      <h3>Server Groups</h3>
      <div className={settingsPaneContent}>
        <SaveGroupForm formState={formState} servers={servers} saveGroup={saveGroup} group={groupEditing || {name: ''}}/>
        <ul>
          {groups && groups.sort((thisGroup, thatGroup) => thisGroup.id - thatGroup.id).map(group => (
            <GroupRow key={group.id} servers={group.servers.map(id => servers[id])} editGroup={editGroup} removeGroup={removeGroup} group={group}/>
          ))}
        </ul>
      </div>
    </div>
  );
}

Groups.propTypes = {
  servers: PropTypes.object.isRequired,
  editGroup: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
  formState: PropTypes.object,
  groups: PropTypes.array,
  groupEditing: PropTypes.object
};

export default Groups;
