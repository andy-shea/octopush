import {hideVisually} from 'polished';
import React, {ReactNode, SFC} from 'react';
import styled from 'styled-components';
import {middleable} from '.';
import Icon from '../icon/Icon';

interface EditButtonProps {
  children: ReactNode;
  middle?: boolean;
}

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

const EditButton: SFC<EditButtonProps> = ({children, ...props}) => {
  return (
    <StyledButton type="button" {...props}>
      <EditIcon />
      <span>{children}</span>
    </StyledButton>
  );
};

export default EditButton;
