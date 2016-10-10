import React, {PropTypes} from 'react';
import cx from 'classnames';
import {root} from './PageLoader.css';

function PageLoader({className = ''}) {
  return <div className={cx(root, className)}>Loading...</div>;
}

PageLoader.propTypes = {className: PropTypes.string};

export default PageLoader;
