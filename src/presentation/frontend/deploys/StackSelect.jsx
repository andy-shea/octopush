import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {root} from './StackSelect.css';

function StackSelect({stacks, selectStack, selected}) {
  const stackOptions = stacks && Object.keys(stacks).map(slug => {
    const stack = stacks[slug];
    return {value: stack.slug, label: stack.title};
  });

  return (
    <Select name="stack" instanceId="stack" clearable={false} options={stackOptions}
      className={root} value={selected && selected.slug} onChange={selectStack}/>
  );
}

StackSelect.propTypes = {
  selectStack: PropTypes.func.isRequired,
  stacks: PropTypes.object,
  selected: PropTypes.object
};

export default StackSelect;
