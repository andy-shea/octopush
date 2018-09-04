import React from 'react';
import styled from 'styled-components';
import {hideVisually} from 'polished';
import {middleable} from '.';
import RemoveIcon from '../icon/RemoveIcon';

// prettier-ignore
const StyledButton = styled.button`
  ${middleable}

  outline: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  padding: 0;
`;

const StyledRemoveIcon = styled(RemoveIcon)`
  width: 30px;
  height: 30px;

  &::before,
  &::after {
    width: 30px !important;
    top: 15px !important;
    left: 0 !important;
    background: var(--color-red-25) !important;
  }

  &:hover::before,
  &:hover::after {
    background: var(--color-red-35) !important;
  }
`;

const Text = styled('span')`
  ${hideVisually()};
`;

function RemoveButton({children, ...props}) {
  return (
    <StyledButton type="button" {...props}>
      <StyledRemoveIcon />
      <Text>{children}</Text>
    </StyledButton>
  );
}

export default RemoveButton;
