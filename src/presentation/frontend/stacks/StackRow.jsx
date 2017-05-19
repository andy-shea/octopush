import React from 'react';
import PropTypes from 'prop-types';
import withHandlers from 'recompose/withHandlers';
import cx from 'classnames';
import Stack from '~/domain/stack/Stack';
import ActionRow from '../ui/ActionRow';
import styles from './StackRow.css';
import {iconEdit, iconRemove, middle} from '../ui/SimpleList.css';
import {svgIcon, iconRemove as baseIconRemove} from '../ui/Icons.css';

const handlers = withHandlers({
  editStack: props => () => {
    props.editStack(props.stack);
  },
  removeStack: props => () => {
    props.removeStack({stack: props.stack});
  }
});

function StackRow({stack, editStack, removeStack}) {
  const {title, gitPath, isDeleting} = stack;
  const actions = [
    <svg title="Edit" className={cx(svgIcon, iconEdit, middle)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#edit"/>'}} onClick={editStack}/>,
    <span title="Remove" className={cx(baseIconRemove, iconRemove, middle)} onClick={removeStack}>Remove stack</span>
  ];

  return (
    <ActionRow actions={actions} isLoading={isDeleting} className={styles.root}>
      <span className={styles.title}><b>{title}</b> <span className={styles.git}>{gitPath}</span></span>
    </ActionRow>
  );
}

StackRow.propTypes = {
  editStack: PropTypes.func.isRequired,
  removeStack: PropTypes.func.isRequired,
  stack: Stack.shape.isRequired
};

export default handlers(StackRow);
