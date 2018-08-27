import React from 'react';
import PropTypes from 'prop-types';
import DeploySelect from './DeploySelect';

function TargetsSelect({groups, servers, selectedTargets, selectTargets}) {
  const targets = groups.map(group => group.name).concat(Object.keys(servers).map(id => servers[id].hostname));
  const targetOptions = targets.map(target => ({value: target, label: target}));
  return (
    <DeploySelect name="targets" instanceId="targets" options={targetOptions} multi placeholder="targets"
      value={selectedTargets} onChange={selectTargets}/>
  );
}

TargetsSelect.propTypes = {
  groups: PropTypes.array.isRequired,
  selectTargets: PropTypes.func.isRequired,
  servers: PropTypes.object,
  selectedTargets: PropTypes.array
};

export default TargetsSelect;
