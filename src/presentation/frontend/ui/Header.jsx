import React, {PropTypes} from 'react';
import cx from 'classnames';
import styles from './Header.css';
import logo from './octopus.png';

function Header({children, className}) {
  return (
    <header className={cx(styles.root, 'clearfix', className)}>
      <h1 className="ir" style={{backgroundImage: `url(${logo})`}}>Octopush</h1>
      {children}
    </header>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Header;
