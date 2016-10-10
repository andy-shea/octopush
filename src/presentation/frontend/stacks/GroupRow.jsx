import React, {PropTypes} from 'react';
import cx from 'classnames';
import Group from '~/domain/stack/Group';
import ActionRow from '../ui/ActionRow';
import {hostnames} from './GroupRow.css';
import {iconEdit, iconRemove, newline} from '../ui/SimpleList.css';
import {svgIcon, iconRemove as baseIconRemove} from '../ui/Icons.css';

function GroupRow({group, servers, editGroup, removeGroup}) {
  const {name, isDeleting} = group;
  const actions = [
    <svg title="Edit" className={cx(svgIcon, iconEdit)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#edit"/>'}} onClick={editGroup}/>,
    <span title="Remove" className={cx(baseIconRemove, iconRemove)} onClick={removeGroup}>Remove group</span>
  ];

  return (
    <ActionRow actions={actions} isLoading={isDeleting} isMultiline>
      <b className={newline}>{name}</b>
      <span className={hostnames}>{servers.map(server => server.hostname).join(', ')}</span>
    </ActionRow>
  );
}

GroupRow.propTypes = {
  group: Group.shape.isRequired,
  servers: PropTypes.array.isRequired,
  editGroup: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired
};

export default GroupRow;
