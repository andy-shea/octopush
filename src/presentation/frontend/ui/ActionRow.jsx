import React, {PropTypes} from 'react';
import cx from 'classnames';
import {root, multiline, loader, actions as actionsStyle} from './SimpleList.css';
import {loader as baseLoader} from './Form.css';

function ActionRow({children, actions, isLoading, isMultiline}) {
  return (
    <li className={cx(root, {[multiline]: isMultiline})}>
      {children}
      {isLoading ? <svg className={cx(baseLoader, loader)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#loader"/>'}}/> : <ul className={actionsStyle}>
        {actions.map((action, index) => <li key={index}>{action}</li>)}
      </ul>}
    </li>
  );
}

ActionRow.propTypes = {
  children: PropTypes.node.isRequired,
  actions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isMultiline: PropTypes.bool
};

export default ActionRow;
