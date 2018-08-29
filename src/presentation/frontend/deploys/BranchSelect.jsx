import React from 'react';
import PropTypes from 'prop-types';
import DeploySelect from './DeploySelect';

function BranchSelect({branches, selectedBranch, updateValue}) {
  const branchOptions = branches
    ? branches.reduce((carry, branch) => {
      carry[branch] = {value: branch, label: branch};
      return carry;
    }, {})
    : {};

  return (
    <DeploySelect
      name="branch"
      instanceId="branch"
      options={Object.values(branchOptions)}
      placeholder="branch"
      value={selectedBranch}
      updateValue={updateValue}
    />
  );
}

BranchSelect.propTypes = {
  branches: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired,
  selectedBranch: PropTypes.object
};

export default BranchSelect;
