import React, {Component, PropTypes} from 'react';
import SaveGroupForm from './SaveGroupForm';
import GroupRow from './GroupRow';
import {settingsPaneContent} from '../ui/Menu.css';

class Groups extends Component {

  static propTypes = {
    servers: PropTypes.object.isRequired,
    editGroup: PropTypes.func.isRequired,
    removeGroup: PropTypes.func.isRequired,
    saveGroup: PropTypes.func.isRequired,
    meta: PropTypes.object,
    groups: PropTypes.array,
    groupEditing: PropTypes.object
  }

  render() {
    const {meta, servers, groups, editGroup, removeGroup, saveGroup, groupEditing} = this.props;
    return (
      <div>
        <h3>Server Groups</h3>
        <div className={settingsPaneContent}>
          <SaveGroupForm meta={meta} servers={servers} saveGroup={saveGroup} group={groupEditing || {name: ''}}/>
          <ul>
            {groups && groups.sort((thisGroup, thatGroup) => thisGroup.id - thatGroup.id).map(group => {
              return (
                <GroupRow key={group.id} servers={group.servers.map(id => servers[id])}
                    editGroup={editGroup.bind(null, group)} removeGroup={removeGroup.bind(null, group)} group={group}/>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

}

export default Groups;
