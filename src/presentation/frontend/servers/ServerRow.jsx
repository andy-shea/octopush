import React from 'react';
import PropTypes from 'prop-types';
import withHandlers from 'recompose/withHandlers';
import Server from '~/domain/server/Server';
import ActionRow from '../ui/list/ActionRow';
import EditButton from '../ui/list/EditButton';
import RemoveButton from '../ui/list/RemoveButton';

const handlers = withHandlers({
  editServer: props => () => {
    props.editServer({server: props.server});
  },
  removeServer: props => () => {
    props.removeServer({serverId: props.server.id});
  }
});

function ServerRow({server, editServer, removeServer}) {
  const {hostname, isDeleting} = server;
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

export default handlers(ServerRow);
