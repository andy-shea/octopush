import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withHandlers from 'recompose/withHandlers';
import Stack from '~/domain/stack/Stack';
import ActionRow from '../ui/list/ActionRow';
import EditButton from '../ui/list/EditButton';
import RemoveButton from '../ui/list/RemoveButton';

const handlers = withHandlers({
  editStack: props => () => {
    props.editStack(props.stack);
  },
  removeStack: props => () => {
    props.removeStack({stack: props.stack});
  }
});

const Title = styled.b`margin-bottom: 0.2em;`;
const GitPath = styled.span`
  font-size: 0.8em;
  margin-left: 1em;
`;

export function StackRow({stack, editStack, removeStack}) {
  const {title, gitPath, isDeleting} = stack;
  const actions = [
    <EditButton onClick={editStack} middle/>,
    <RemoveButton onClick={removeStack} middle>Remove stack</RemoveButton>
  ];

  return (
    <ActionRow actions={actions} isLoading={isDeleting} height={54}>
      <Title><b>{title}</b> <GitPath>{gitPath}</GitPath></Title>
    </ActionRow>
  );
}

StackRow.propTypes = {
  editStack: PropTypes.func.isRequired,
  removeStack: PropTypes.func.isRequired,
  stack: Stack.shape.isRequired
};

export default handlers(StackRow);
