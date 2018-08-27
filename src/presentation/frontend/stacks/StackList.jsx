import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import StackRow from './StackRow';
import SettingsPaneContent from '../ui/menu/SettingsPaneContent';

const StyledStackList = styled.div`
  min-width: 530px;
  height: 100%;
`

const NewStackButton = styled.button`
  outline: none;
  text-transform: uppercase;
  transition: all 0.1s;
  padding: 6px 15px;
  font-size: 0.9rem;
  font-weight: normal;
  border: 1px solid var(--color-red-10);
  background-color: transparent;
  color: var(--color-red-15);
  vertical-align: middle;
  margin-left: 1em;

  &:hover,
  &:focus {
    background: var(--color-red-10);
    color: var(--color-blue-10);
  }
`;

function StackList({stacks, createStack, editStack, removeStack}) {
  return (
    <StyledStackList>
      <h2>
        Stacks
        {createStack && <NewStackButton onClick={createStack}>Add New Stack</NewStackButton>}
      </h2>
      <MenuScrollPane>
        <SettingsPaneContent>
          <ul>
            {stacks && Object.keys(stacks).sort().map(slug => {
              const stack = stacks[slug];
              return <StackRow key={stack.id} stack={stack} editStack={editStack} removeStack={removeStack}/>;
            })}
          </ul>
        </SettingsPaneContent>
      </MenuScrollPane>
    </StyledStackList>
  );
}

StackList.propTypes = {
  editStack: PropTypes.func.isRequired,
  removeStack: PropTypes.func.isRequired,
  createStack: PropTypes.func,
  stacks: PropTypes.object
};

export default StackList;
