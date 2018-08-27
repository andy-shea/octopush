import React from 'react';
import PropTypes from 'prop-types';
import DeploySelect from './DeploySelect';

function BranchSelect({branches, selectBranch, selectedBranch}) {
  const branchOptions = branches && branches.map(branch => ({value: branch, label: branch}));
  return (
    <DeploySelect name="branch" instanceId="branch" clearable={false} options={branchOptions} placeholder="branch"
      value={selectedBranch} onChange={selectBranch}/>
  );
}

BranchSelect.propTypes = {
  branches: PropTypes.array.isRequired,
  selectBranch: PropTypes.func.isRequired,
  selectedBranch: PropTypes.string
};

export default BranchSelect;
