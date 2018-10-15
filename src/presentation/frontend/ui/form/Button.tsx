import React, {SFC} from 'react';
import styled, {css} from 'styled-components';
import Icon from '../icon/Icon';

const StyledButton = styled.button`
  outline: none;
  text-transform: uppercase;
  transition: all 0.1s;
  border: none;
  font-size: 0.9em;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  position: relative;
  background-color: var(--color-blue-10);
  color: #fff;
  line-height: 34px;
  margin: 1px;
  margin-left: 0;
  padding: ${({large}: {large?: boolean}) => (large ? '10px 30px' : '0 30px')};
  white-space: nowrap;

  ${({cta}: {cta?: boolean}) => cta && css`
    background: var(--color-green);
    color: #fff;
  `}

  &:hover,
  &:focus {
    background: #fff;
    color: var(--color-blue-10);

    ${({cta}: {cta?: boolean}) => cta && css`
      background: #fff;
      color: var(--color-green);
      box-shadow: 0 1px 1px var(--color-grey-5);
    `};
  }
`;

const Loader = styled(Icon).attrs({type: 'loader'})`
  height: 20px;
  fill: currentColor;
  background: inherit;
  transform: translateY(4px);
  width: 0;
  margin: 0;
  transition: all 0.1s, background-color 0s none;

  ${({isLoading}: {isLoading?: boolean}) => isLoading && css`
    margin-left: 6px;
    width: 20px;
  `};
`;

interface ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  large?: boolean;
  cta?: boolean;
}

const Button: SFC<ButtonProps> = ({children, isLoading, ...props}) => {
  return (
    <StyledButton {...props}>
      {children}
      <Loader isLoading={isLoading} />
    </StyledButton>
  );
};

export default Button;
