import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import lifecycle from 'recompose/lifecycle';
import {svgIcon} from '../Icons.css';
import {menuButton, leave, leaveActive, enter, enterActive} from './Menu.css';

const TICK = 17;

const enhance = lifecycle({
  componentWillEnter(callback) {
    const node = ReactDOM.findDOMNode(this);
    node.classList.add(enter);
    setTimeout(() => {
      node.classList.add(enterActive);
      node.addEventListener('transitionend', () => {
        node.classList.remove(enter, enterActive);
        callback();
      });
    }, TICK);
  },
  componentWillLeave(callback) {
    const node = ReactDOM.findDOMNode(this);
    node.classList.add(leave);
    setTimeout(() => {
      node.classList.add(leaveActive);
      node.addEventListener('transitionend', () => {
        node.classList.remove(leave, leaveActive);
        callback();
      });
    }, TICK);
  }
});

function MenuButton({toggleMenu}) {
  return (
    <button id="menu-btn" className={menuButton} type="button" onClick={toggleMenu}>
      <svg className={svgIcon} dangerouslySetInnerHTML={{__html: '<use xlink:href="#settings"/>'}}/>
      <span>Settings Menu</span>
    </button>
  );
}

MenuButton.propTypes = {toggleMenu: PropTypes.func.isRequired};

export default enhance(MenuButton);
