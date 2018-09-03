import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Transition} from 'react-transition-group';
import withHandlers from 'recompose/withHandlers';
import ServersContainer from '../../servers/ServersContainer';
import StacksContainer from '../../stacks/StacksContainer';
import Icon from '../icon/Icon';
import ServerIcon from '../icon/ServerIcon';
import CloseIcon from '../icon/CloseIcon';

let velocity;
if (typeof window !== 'undefined') velocity = require('velocity-animate');

const openClass = 'open';
const closedClass = 'closed';

function onEnter(menu) {
  if (typeof window !== 'undefined') {
    menu.classList.add(closedClass);
    Object.assign(menu.style, {left: '50px', bottom: '50px', width: '50px', height: '50px', top: 'auto'});
  }
}

function onEntering(menu) {
  if (typeof window !== 'undefined') {
    requestAnimationFrame(() => { // allow closedClass added in onEnter to reflow
      menu.classList.remove(closedClass);
      velocity(menu, {left: 0, top: 0, width: 300, height: '100%'}, {duration: 400, delay: 50, easing: [0.7, 0, 0.3, 1]});
    });
  }
}

function onExit(menu) {
  if (typeof window !== 'undefined') {
    menu.classList.add(closedClass);
    menu.classList.remove(openClass);
    Object.assign(menu.style, {zIndex: 900, top: 'auto', bottom: 'auto'});
  }
}

function onExiting(menu) {
  if (typeof window !== 'undefined') {
    velocity(menu, {left: '50px', bottom: '50px', width: '50px', height: '50px'}, {duration: 400, delay: 50, easing: [0.7, 0, 0.3, 1]});
  }
}

const StyledMenuContents = styled.div`
  pointer-events: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1900;
  opacity: 1;
  background: var(--color-red);
  width: 300px;
  height: 100%;
  overflow: hidden;

  &.open {
    width: auto !important;
  }

  & h2,
  & h3 {
    color: var(--color-red-15);
    font-weight: 300;
  }

  & h2 {
    font-size: 2em;
    padding: 0.5em 2vw 0;
    letter-spacing: -1px;
  }

  & h3 {
    font-size: 1.5em;
    padding: 0 2vw;
    letter-spacing: -0.5px;
    margin-top: 0;
  }

  & > div {
    visibility: visible;
    height: 100%;
    opacity: 1;
    transition: opacity 0.3s 0.5s;
    display: flex;
  }

  &.${closedClass} > div {
    visibility: hidden;
    height: 0;
    opacity: 0;
    transition: opacity 0.1s, visibility 0s 0.1s, height 0s 0.1s;
  }
`;

const Sidebar = styled.div`
  position: relative;
  max-width: 300px;
  min-width: 300px;

  & ul,
  & li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  & ul {
    border-top: 1px solid var(--color-red-10);
  }

  & li {
    border-bottom: 1px solid var(--color-red-10);
  }

  & li svg {
    margin: 2% 5% 2% 2vw;
    float: left;
    stroke: var(--color-red-25);
  }

  & li a,
  & li a:visited,
  & li a:active,
  & li a:focus,
  & li a:hover {
    padding: 6px 15px;
    display: block;
    line-height: 40px;
    padding-left: 50px;
    color: white;
    text-decoration: none;
    font-size: 1.2em;
  }

  & li a:active,
  & li a:focus,
  & li a:hover {
    background: var(--color-red-highlight);
  }
`;

const StackIcon = styled(Icon).attrs({type: 'stacks'})`
  background: transparent;
  width: 36px;
  margin-left: 1.7vw !important;
`;

const MenuServerIcon = styled(ServerIcon)`
  background: transparent;
  border-color: var(--color-red-20);
  width: 24px;
  height: 24px;
  float: left;
  margin: 4.5% 7% 4.5% 2.1vw;
`;

const LogoutIcon = styled(Icon).attrs({type: 'logout'})`
  background: transparent;
  width: 32px;
  margin-left: 1.9vw !important;
`;

const SettingsPane = styled.div`
  border-left: 1px solid var(--color-red-10);
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: ${({open}) => open ? 'block' : 'none'};
`;

const handlers = {
  openServersPane: ({openPane}) => event => {
    event.preventDefault();
    openPane(<ServersContainer/>);
  },

  openStacksPane: ({openPane}) => event => {
    event.preventDefault();
    openPane(<StacksContainer/>);
  }
};

let enhance = withHandlers(handlers);

function MenuContents({toggleMenu, settingsPane, openStacksPane, openServersPane, in: transitionIn}) {
  return (
    <Transition
      in={transitionIn}
      onEnter={onEnter}
      onEntering={onEntering}
      onExit={onExit}
      onExiting={onExiting}
      timeout={{enter: 500, exit: 100}}
    >
      <StyledMenuContents className={settingsPane && openClass}>
        <div>
          <Sidebar>
            <CloseIcon title="Close settings" onClick={toggleMenu}>Close settings</CloseIcon>
            <h2>Octopush</h2>
            <ul>
              <li>
                <StackIcon/>
                <a href="#" onClick={openStacksPane}>Stacks</a>
              </li>
              <li>
                <MenuServerIcon/>
                <a href="#" onClick={openServersPane}>Servers</a>
              </li>
              <li>
                <LogoutIcon/>
                <a href="/logout">Log out</a>
              </li>
            </ul>
          </Sidebar>
          <SettingsPane open={!!settingsPane}>
            {settingsPane}
          </SettingsPane>
        </div>
      </StyledMenuContents>
    </Transition>
  );
}

MenuContents.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  openStacksPane: PropTypes.func.isRequired,
  openServersPane: PropTypes.func.isRequired,
  settingsPane: PropTypes.element,
  in: PropTypes.bool
};

export default enhance(MenuContents);
