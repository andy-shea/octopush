import React from 'react';
import styled from 'styled-components';
import {hideVisually} from 'polished';
import {middleable} from '.';
import Icon from '../icon/Icon';

// prettier-ignore
const StyledButton = styled.button`
  ${middleable}

  outline: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  padding: 0;

  & > span {
    ${hideVisually()};
  }
`;

const EditIcon = styled(Icon).attrs({type: 'edit'})`
  width: 32px !important;
  height: 32px !important;
  stroke: var(--color-red-25) !important;
  cursor: pointer;
  margin: 5px 0 0;

  &:hover {
    stroke: var(--color-red-35) !important;
  }
`;

function EditButton({children, ...props}) {
  return (
    <StyledButton type="button" {...props}>
      <EditIcon />
      <span>{children}</span>
    </StyledButton>
  );
}

export default EditButton;
