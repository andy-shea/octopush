import React from 'react';
import PropTypes from 'prop-types';
import {compose, withState, withHandlers} from 'recompose';
import Server from '~/domain/server/Server';
import ActionRow from '../ui/list/ActionRow';
import EditButton from '../ui/list/EditButton';
import RemoveButton from '../ui/list/RemoveButton';

const enhance = compose(
  withState('isDeleting', 'setIsDeleting'),
  withHandlers({
    editServer: props => () => {
      props.editServer(props.server);
    },
    removeServer: props => () => {
      props.setIsDeleting(true);
      props.removeServer({serverId: props.server.id});
    }
  })
);

function ServerRow({server, isDeleting, editServer, removeServer}) {
  const {hostname} = server;
  // prettier-ignore
  const actions = [
    <EditButton onClick={editServer} title="Edit server" middle>Edit server</EditButton>, // eslint-disable-line react/jsx-key
    <RemoveButton onClick={removeServer} title="Remove server" middle>Remove server</RemoveButton> // eslint-disable-line react/jsx-key
  ];
  return (
    <ActionRow actions={actions} isLoading={isDeleting} height={52}>
      {hostname}
    </ActionRow>
  );
}

ServerRow.propTypes = {
  server: Server.shape.isRequired,
  editServer: PropTypes.func.isRequired,
  removeServer: PropTypes.func.isRequired
};

export default enhance(ServerRow);
