import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import MenuButton from './MenuButton';
import MenuContents from './MenuContents';

const StyledMenu = styled.div`
  display: block;
  margin: 0 auto;
`;

function Menu({toggleMenu, expanded, openPane, settingsPane}) {
  return (
    <StyledMenu>
      <TransitionGroup component={null}>
        {expanded
          ? <MenuContents key="menu-contents" toggleMenu={toggleMenu} settingsPane={settingsPane} openPane={openPane}/>
          : <MenuButton key="menu-btn" toggleMenu={toggleMenu}/>
        }
      </TransitionGroup>
    </StyledMenu>
  );
}

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  settingsPane: PropTypes.element
};

export default Menu;
