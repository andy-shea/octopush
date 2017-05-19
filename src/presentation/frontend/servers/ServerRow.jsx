import React from 'react';
import PropTypes from 'prop-types';
import withHandlers from 'recompose/withHandlers';
import cx from 'classnames';
import Server from '~/domain/server/Server';
import ActionRow from '../ui/ActionRow';
import {root} from './ServerRow.css';
import {iconEdit, iconRemove, middle} from '../ui/SimpleList.css';
import {svgIcon, iconRemove as baseIconRemove} from '../ui/Icons.css';

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
    <svg title="Edit" className={cx(svgIcon, iconEdit, middle)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#edit"/>'}} onClick={editServer}/>,
    <span title="Remove" className={cx(baseIconRemove, iconRemove, middle)} onClick={removeServer}>Remove server</span>
  ];
  return <ActionRow actions={actions} isLoading={isDeleting} className={root}>{hostname}</ActionRow>;
}

ServerRow.propTypes = {
  server: Server.shape.isRequired,
  editServer: PropTypes.func.isRequired,
  removeServer: PropTypes.func.isRequired
};

export default handlers(ServerRow);
