import React, {PropTypes} from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import cx from 'classnames';
import 'normalize.css/normalize.css';
import 'react-select/dist/react-select.css';
import Menu from './menu/Menu';
import {container, pushed} from './menu/Menu.css';
import './base.css';
import './helpers.css';
import './ReactSelect.css';

const handlers = {
  openPane: ({updateMenu}) => settingsPane => {
    updateMenu(state => ({...state, settingsPane}));
  },

  toggleMenu: ({updateMenu}) => () => {
    updateMenu(state => ({...state, isExpanded: !state.isExpanded, settingsPane: undefined}));
  }
};

const enhance = compose(
  withState('menu', 'updateMenu', {isExpanded: false, settingsPane: null}),
  withHandlers(handlers)
);

function Layout({isAuthenticated, children, toggleMenu, menu: {isExpanded, settingsPane}, openPane}) {
  return (
    <div>
      <div id="container" className={cx(container, {[pushed]: isExpanded})}>
        {children}
      </div>
      {isAuthenticated && <Menu toggleMenu={toggleMenu} isExpanded={isExpanded} settingsPane={settingsPane} openPane={openPane}/>}
    </div>
  );
}

Layout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  menu: PropTypes.shape({
    isExpanded: PropTypes.bool.isRequired,
    settingsPane: PropTypes.element
  })
};

export default enhance(Layout);
