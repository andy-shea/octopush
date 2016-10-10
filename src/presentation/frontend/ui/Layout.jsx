import React, {PropTypes} from 'react';
import Menu from './Menu';
import 'normalize.css/normalize.css';
import 'react-select/dist/react-select.css';
import './base.css';
import './helpers.css';
import './ReactSelect.css';
import {container} from './Menu.css';

function Layout({isAuthenticated, children}) {
  return (
    <div>
      <div id="container" className={container}>
        {children}
      </div>
      {isAuthenticated && <Menu/>}
    </div>
  );
}

Layout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

export default Layout;
