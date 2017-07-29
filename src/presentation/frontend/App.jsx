import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import cx from 'classnames';
import 'normalize.css/normalize.css';
import 'react-select/dist/react-select.css';
import Menu from './ui/menu/Menu';
import {container, pushed} from './ui/menu/Menu.css';
import './ui/base.css';
import './ui/helpers.css';
import './ui/ReactSelect.css';

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

function App({children, toggleMenu, menu: {isExpanded, settingsPane}, openPane}) {
  return (
    <div>
      <div id="container" className={cx(container, {[pushed]: isExpanded})}>
        {children}
      </div>
      <Menu toggleMenu={toggleMenu} isExpanded={isExpanded} settingsPane={settingsPane} openPane={openPane}/>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  menu: PropTypes.shape({
    isExpanded: PropTypes.bool.isRequired,
    settingsPane: PropTypes.element
  })
};

export default enhance(App);
