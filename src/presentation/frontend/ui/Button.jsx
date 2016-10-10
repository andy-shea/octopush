import React, {PropTypes} from 'react';
import classNames from 'classnames';
import styles from './Form.css';

function Button({children, isLoading, className = '', ...props}) {
  return (
    <button className={classNames(className, styles.button, {[styles.isLoading]: isLoading})} {...props}>
      {children}
      <svg className={styles.loader} dangerouslySetInnerHTML={{__html: '<use xlink:href="#loader"/>'}}/>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Button;
