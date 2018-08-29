import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import {clearFix, hideText} from 'polished';
import logo from './octopus.png';

const StyledHeader = styled.header`
  ${clearFix()};
  &::before {
    content: ' ';
    display: table;
  }
  ${({centred}) =>
    centred &&
    css`
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    `};
`;

const Title = styled.h1`
  background: no-repeat 50% 50%;
  background-size: 100%;
  width: 150px;
  height: 190px;
  float: left;
  margin: 0 0 0 5%;
  position: relative;
  z-index: 1;
  background-image: url(${logo});
  ${hideText()};
`;

function Header({children, centred = false}) {
  return (
    <StyledHeader centred={centred}>
      <Title>Octopush</Title>
      {children}
    </StyledHeader>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  centred: PropTypes.bool
};

export default Header;
