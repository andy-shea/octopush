import {clearFix, hideText} from 'polished';
import React, {SFC} from 'react';
import styled, {css} from 'styled-components';
// @ts-ignore
import logo from './octopus.png';

const StyledHeader = styled.header`
  ${clearFix()};
  &::before {
    content: ' ';
    display: table;
  }
  ${({centred}: {centred?: boolean}) => centred && css`
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

interface HeaderProps {
  children: React.ReactNode;
  centred?: boolean;
  className?: string;
}

const Header: SFC<HeaderProps> = ({centred = false, children, className}) => {
  return (
    <StyledHeader centred={centred} className={className}>
      <Title>Octopush</Title>
      {children}
    </StyledHeader>
  );
};

export default Header;
