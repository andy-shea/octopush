import React from 'react';
import PropTypes from 'prop-types';
import DeploySelect from './DeploySelect';

function TargetsSelect({groups, servers, selectedTargets = [], updateValue}) {
  const targetOptions = groups.reduce((carry, {name}) => {
    carry[name] = {value: name, label: name};
    return carry;
  }, {});
  const serverOptions = Object.keys(servers).reduce((carry, id) => {
    const {hostname} = servers[id];
    carry[hostname] = {value: hostname, label: hostname};
    return carry;
  }, {});
  const groupedOptions = [
    {label: 'Groups', options: Object.values(targetOptions)},
    {label: 'Servers', options: Object.values(serverOptions)}
  ];

  return (
    <DeploySelect name="targets" instanceId="targets" options={groupedOptions} isMulti
      placeholder="targets" value={selectedTargets} updateValue={updateValue}/>
  );
}

TargetsSelect.propTypes = {
  groups: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired,
  servers: PropTypes.object,
  selectedTargets: PropTypes.array
};

export default TargetsSelect;
