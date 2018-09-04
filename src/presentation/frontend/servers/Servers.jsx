import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import ServerRow from './ServerRow';
import SaveServerForm from './SaveServerForm';
import SettingsPaneContent from '../ui/menu/SettingsPaneContent';

const StyledServers = styled.div`
  min-width: 530px;
  height: 100%;
`;

function Servers({formState, servers, serverEditing, saveServer, editServer, removeServer}) {
  return (
    <StyledServers>
      <h2>Servers</h2>
      <MenuScrollPane>
        <SettingsPaneContent>
          <SaveServerForm formState={formState} server={serverEditing} saveServer={saveServer} />
          <ul data-testid="servers">
            {servers &&
              Object.keys(servers).map(id => {
                const server = servers[id];
                return (
                  <ServerRow
                    key={id}
                    server={server}
                    editServer={editServer}
                    removeServer={removeServer}
                  />
                );
              })}
          </ul>
        </SettingsPaneContent>
      </MenuScrollPane>
    </StyledServers>
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
