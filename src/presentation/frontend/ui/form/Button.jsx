import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import Icon from '../icon/Icon';

const StyledButton = styled.button`
  outline: none;
  text-transform: uppercase;
  transition: all 0.1s;
  padding: 6px 15px;
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
  padding: ${({large}) => (large ? '10px 30px' : '0 30px')};
  white-space: nowrap;

  ${({cta}) =>
    cta &&
    css`
      background: var(--color-green);
      color: #fff;
    `} &:hover,
  &:focus {
    background: #fff;
    color: var(--color-blue-10);

    ${({cta}) =>
    cta &&
      css`
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
  stroke: none;
  transition: all 0.1s, background: 0s none;

  ${({isLoading}) =>
    isLoading &&
    css`
      margin-left: 6px;
      width: 20px;
    `};
`;

function Button({children, isLoading, ...props}) {
  return (
    <StyledButton {...props}>
      {children}
      <Loader isLoading={isLoading} />
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  large: PropTypes.bool,
  cta: PropTypes.bool
};

export default Button;
