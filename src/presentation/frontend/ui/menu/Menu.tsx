import React, {ReactElement, SFC} from 'react';
import {TransitionGroup} from 'react-transition-group';
import styled from 'styled-components';
import MenuButton from './MenuButton';
import MenuContents from './MenuContents';

interface MenuProps {
  expanded: boolean;
  settingsPane?: ReactElement<any>;
  toggleMenu(): void;
  openPane(settingsPane: ReactElement<any>): void;
}

const StyledMenu = styled.div`
  display: block;
  margin: 0 auto;
`;

const Menu: SFC<MenuProps> = ({toggleMenu, expanded, openPane, settingsPane}) => {
  return (
    <StyledMenu>
      <TransitionGroup component={undefined}>
        {expanded
          ? <MenuContents key="menu-contents" toggleMenu={toggleMenu} settingsPane={settingsPane} openPane={openPane}/>
          : <MenuButton key="menu-btn" toggleMenu={toggleMenu}/>
        }
      </TransitionGroup>
    </StyledMenu>
  );
};

export default Menu;
