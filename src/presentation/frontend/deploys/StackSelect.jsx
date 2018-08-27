import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DeploySelect from './DeploySelect';

const StyledStackSelect = styled.div`
  margin: 30px 0 0;
  position: relative;

  &::before {
    position: absolute;
    color: var(--color-grey-30);
    text-transform: uppercase;
    font-size: 0.7em;
    content: 'Stack:';
    top: -20px;
  }
`;

function StackSelect({stacks, selectStack, selected}) {
  const stackOptions = stacks && Object.keys(stacks).map(slug => {
    const stack = stacks[slug];
    return {value: stack.slug, label: stack.title};
  });

  return (
    <StyledStackSelect>
      <DeploySelect name="stack" instanceId="stack" clearable={false} options={stackOptions}
        value={selected && selected.slug} onChange={selectStack}/>
    </StyledStackSelect>
  );
}

StackSelect.propTypes = {
  selectStack: PropTypes.func.isRequired,
  stacks: PropTypes.object,
  selected: PropTypes.object
};

export default StackSelect;
