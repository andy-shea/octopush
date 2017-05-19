import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {root} from './PageLoader.css';

function PageLoader({className = ''}) {
  return <div className={cx(root, className)}>Loading...</div>;
}

PageLoader.propTypes = {className: PropTypes.string};

export default PageLoader;
