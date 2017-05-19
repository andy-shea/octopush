import React from 'react';
import PropTypes from 'prop-types';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import StackRow from './StackRow';
import {root} from './StackList.css';
import {settingsPaneContent} from '../ui/menu/Menu.css';
import {headerButton} from '../ui/Form.css';

function StackList({stacks, createStack, editStack, removeStack}) {
  return (
    <div className={root}>
      <h2>
        Stacks
        {createStack && <button className={headerButton} onClick={createStack}>Add New Stack</button>}
      </h2>
      <MenuScrollPane>
        <div className={settingsPaneContent}>
          <ul>
            {stacks && Object.keys(stacks).sort().map(slug => {
              const stack = stacks[slug];
              return <StackRow key={stack.id} stack={stack} editStack={editStack} removeStack={removeStack}/>;
            })}
          </ul>
        </div>
      </MenuScrollPane>
    </div>
  );
}

StackList.propTypes = {
  editStack: PropTypes.func.isRequired,
  removeStack: PropTypes.func.isRequired,
  createStack: PropTypes.func,
  stacks: PropTypes.object
};

export default StackList;
