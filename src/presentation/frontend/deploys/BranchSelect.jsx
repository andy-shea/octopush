import React, {PropTypes} from 'react';
import cx from 'classnames';
import Select from 'react-select';
import {deploySelect, branchSelect} from './DeploySettings.css';

function BranchSelect({branches, selectBranch, selectedBranch}) {
  const branchOptions = branches.map(branch => ({value: branch, label: branch}));
  return (
    <Select name="branch" instanceId="branch" clearable={false} options={branchOptions} placeholder="branch"
        className={cx(deploySelect, branchSelect)} value={selectedBranch} onChange={selectBranch}/>
  );
}

BranchSelect.propTypes = {
  branches: PropTypes.array.isRequired,
  selectBranch: PropTypes.func.isRequired,
  selectedBranch: PropTypes.string
};

export default BranchSelect;
