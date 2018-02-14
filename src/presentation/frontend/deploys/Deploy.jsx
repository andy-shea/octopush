import React from 'react';
import DeploySettingsContainer from './DeploySettingsContainer';
import DeployListContainer from './DeployListContainer';

function Deploy() {
  return (
    <React.Fragment>
      <DeploySettingsContainer/>
      <DeployListContainer/>
    </React.Fragment>
  );
}

export default Deploy;
