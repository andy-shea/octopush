import React from 'react';
import PropTypes from 'prop-types';
import withHandlers from 'recompose/withHandlers';
import Server from '~/domain/server/Server';
import ActionRow from '../ui/list/ActionRow';
import EditButton from '../ui/list/EditButton';
import RemoveButton from '../ui/list/RemoveButton';

const handlers = withHandlers({
  editServer: props => () => {
    props.editServer(props.server);
  },
  removeServer: props => () => {
    props.removeServer({server: props.server});
  }
});

function ServerRow({server, editServer, removeServer}) {
  const {hostname, isDeleting} = server;
  const actions = [
    <EditButton onClick={editServer} middle/>,
    <RemoveButton onClick={removeServer} middle>Remove server</RemoveButton>
  ];
  return <ActionRow actions={actions} isLoading={isDeleting} height={52}>{hostname}</ActionRow>;
}

ServerRow.propTypes = {
  server: Server.shape.isRequired,
  editServer: PropTypes.func.isRequired,
  removeServer: PropTypes.func.isRequired
};

export default handlers(ServerRow);
