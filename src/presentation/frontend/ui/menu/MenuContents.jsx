import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';
import cx from 'classnames';
import ServersContainer from '../../servers/ServersContainer';
import StacksContainer from '../../stacks/StacksContainer';
import {svgIcon, iconClose, iconServer} from '../Icons.css';
import styles from './Menu.css';

const TICK = 17;

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

if (typeof window !== 'undefined') {
  const velocity = require('velocity-animate');
  const transitionHandlers = {
    componentWillEnter(complete) {
      const node = ReactDOM.findDOMNode(this);
      Object.assign(node.style, {left: '50px', bottom: '50px', width: '50px', height: '50px', top: 'auto'});
      node.classList.add(styles.closed);
      setTimeout(() => {
        node.classList.remove(styles.closed);
        velocity(node, {left: 0, top: 0, width: 300, height: '100%'}, {duration: 400, delay: 50, easing: [0.7, 0, 0.3, 1], complete});
      }, TICK);
    },

    componentWillLeave(complete) {
      const node = ReactDOM.findDOMNode(this);
      node.classList.add(styles.closed);
      node.classList.remove(styles.settingsOpen);
      Object.assign(node.style, {zIndex: 900, top: 'auto', bottom: 'auto'});
      velocity(node, {left: '50px', bottom: '50px', width: '50px', height: '50px'}, {duration: 400, delay: 50, easing: [0.7, 0, 0.3, 1], complete() {
        setTimeout(complete, 100);
      }});
    }
  };

  enhance = compose(lifecycle(transitionHandlers), enhance);
}

function MenuContents({toggleMenu, settingsPane, openStacksPane, openServersPane}) {
  return (
    <div className={cx(styles.menuContents, {[styles.settingsOpen]: settingsPane})}>
      <div>
        <div className={styles.contentStyleSidebar}>
          <span title="Close settings" className={cx(iconClose, styles.iconClose)} onClick={toggleMenu}>Close settings</span>
          <h2>Octopush</h2>
          <ul>
            <li>
              <svg className={cx(svgIcon, styles.iconStacks)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#stacks"/>'}}/>
              <a href="#" onClick={openStacksPane}>Stacks</a>
            </li>
            <li>
              <span className={cx(iconServer, styles.iconServer)}/>
              <a href="#" onClick={openServersPane}>Servers</a>
            </li>
            <li>
              <svg className={cx(svgIcon, styles.iconLogout)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#logout"/>'}}/>
              <a href="/logout">Log out</a>
            </li>
          </ul>
        </div>
        <div className={styles.settingsPane}>
          {settingsPane}
        </div>
      </div>
    </div>
  );
}

MenuContents.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  openStacksPane: PropTypes.func.isRequired,
  openServersPane: PropTypes.func.isRequired,
  settingsPane: PropTypes.element
};

export default enhance(MenuContents);
