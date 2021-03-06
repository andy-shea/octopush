import React, {SFC} from 'react';
import styled, {css} from 'styled-components';
import Icon from '../icon/Icon';

const StyledActionRow = styled.li<{isMultiline?: boolean}>`
  border-bottom: 1px solid var(--color-red-10);
  padding: 6px 15px;
  display: block;
  line-height: 40px;
  font-size: 1.2em;
  position: relative;

  ${({isMultiline}) => isMultiline && css`
    padding: 16px 100px 16px 15px;
    line-height: 18px;
    position: relative;
  `};
`;

const ActionList = styled.ul<{height?: number}>`
  display: none;
  align-items: center;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding-right: 15px;
  background-color: var(--color-red);
  height: ${({height}) => `${height}px`};

  ${StyledActionRow}:hover & {
    display: flex;
  }

  &::before {
    width: 20px;
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(to left, var(--color-red), transparent);
    position: absolute;
    left: -20px;
  }

  & > li {
    margin-left: 5px;
    height: 100%;
    padding: 0 4px;
  }
`;

// prettier-ignore
const Loader = styled(Icon).attrs({type: 'loader'})`
  width: 28px;
  height: 28px;
  position: absolute;
  right: 15px;
  fill: var(--color-red-25);
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
`;

interface ActionRowProps {
  children: React.ReactNode;
  actions: React.ReactNode[];
  height: number;
  isLoading?: boolean;
  isMultiline?: boolean;
}

const ActionRow: SFC<ActionRowProps> = ({children, actions, isLoading, height, isMultiline}) => {
  return (
    <StyledActionRow isMultiline={isMultiline}>
      {children}
      {isLoading ? (
        <Loader />
      ) : (
        <ActionList height={height}>
          {actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ActionList>
      )}
    </StyledActionRow>
  );
};

export default ActionRow;
