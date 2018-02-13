import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import MenuButton from './MenuButton';
import MenuContents from './MenuContents';
import {menu} from './Menu.css';

function Menu({toggleMenu, isExpanded, openPane, settingsPane}) {
  return (
    <div className={menu}>
      <TransitionGroup component="div">
        {isExpanded
          ? <MenuContents key="menu-contents" toggleMenu={toggleMenu} settingsPane={settingsPane} openPane={openPane}/>
          : <MenuButton key="menu-btn" toggleMenu={toggleMenu}/>
        }
      </TransitionGroup>
    </div>
  );
}

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  settingsPane: PropTypes.element
};

export default Menu;
