import React, {PropTypes} from 'react';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import ServerRow from './ServerRow';
import SaveServerForm from './SaveServerForm';
import {root} from './Servers.css';
import {settingsPaneContent} from '../ui/menu/Menu.css';

function Servers({formState, servers, serverEditing, saveServer, editServer, removeServer}) {
  return (
    <div className={root}>
      <h2>Servers</h2>
      <MenuScrollPane>
        <div className={settingsPaneContent}>
          <SaveServerForm formState={formState} server={serverEditing} saveServer={saveServer}/>
          <ul>
            {servers && Object.keys(servers).map(id => {
              const server = servers[id];
              return <ServerRow key={id} server={server} editServer={editServer} removeServer={removeServer}/>;
            })}
          </ul>
        </div>
      </MenuScrollPane>
    </div>
  );
}

Servers.propTypes = {
  saveServer: PropTypes.func.isRequired,
  editServer: PropTypes.func.isRequired,
  removeServer: PropTypes.func.isRequired,
  formState: PropTypes.object,
  servers: PropTypes.object,
  serverEditing: PropTypes.object
};

export default Servers;
