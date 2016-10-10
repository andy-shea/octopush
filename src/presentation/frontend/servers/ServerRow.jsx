import React, {PropTypes} from 'react';
import cx from 'classnames';
import Server from '~/domain/server/Server';
import ActionRow from '../ui/ActionRow';
import {iconEdit, iconRemove} from '../ui/SimpleList.css';
import {svgIcon, iconRemove as baseIconRemove} from '../ui/Icons.css';

function ServerRow({server, editServer, removeServer}) {
  const {hostname, isDeleting} = server;
  const actions = [
    <svg title="Edit" className={cx(svgIcon, iconEdit)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#edit"/>'}} onClick={editServer}/>,
    <span title="Remove" className={cx(baseIconRemove, iconRemove)} onClick={removeServer}>Remove server</span>
  ];
  return <ActionRow actions={actions} isLoading={isDeleting}>{hostname}</ActionRow>;
}

ServerRow.propTypes = {
  server: Server.shape.isRequired,
  editServer: PropTypes.func.isRequired,
  removeServer: PropTypes.func.isRequired
};

export default ServerRow;
