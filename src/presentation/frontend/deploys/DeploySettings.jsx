import React from 'react';
import PropTypes from 'prop-types';
import {connectForm} from 'redux-formalize';
import cx from 'classnames';
import Button from '../ui/Button';
import StackSelect from './StackSelect';
import BranchSelect from './BranchSelect';
import TargetsSelect from './TargetsSelect';
import Header from '../ui/Header';
import {button, large, cta} from '../ui/Form.css';
import {content} from '../ui/Header.css';
import {deployButton, stackSelectWrap, deploy} from './DeploySettings.css';
import {formName} from './actions';

export function DeploySettings({state, fields, submitForm, updateBranch, updateTargets, stack, stacks, servers, branches, selectStack}) {
  const {branch, targets} = fields;
  return (
    <Header>
      <div className={cx(content, stackSelectWrap)}>
        <StackSelect stacks={stacks} selected={stack} selectStack={selectStack}/>
      </div>
      {stack && <form className={deploy} onSubmit={submitForm}>
        <BranchSelect branches={branches} selectBranch={updateBranch} selectedBranch={branch}/>
        to
        <TargetsSelect groups={stack.groups} servers={servers} selectTargets={updateTargets} selectedTargets={targets}/>
        <Button type="submit" isLoading={state.isSubmitting} className={cx(button, large, cta, deployButton)}>Deploy!</Button>
      </form>}
    </Header>
  );
}

DeploySettings.propTypes = {
  fields: PropTypes.shape({
    branch: PropTypes.string,
    targets: PropTypes.array
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  startDeploy: PropTypes.func.isRequired,
  selectStack: PropTypes.func.isRequired,
  updateBranch: PropTypes.func.isRequired,
  updateTargets: PropTypes.func.isRequired,
  branches: PropTypes.array,
  stack: PropTypes.object,
  stacks: PropTypes.object,
  servers: PropTypes.object,
  state: PropTypes.object
};

function onSubmit({fields, stack, startDeploy}) {
  const {branch, targets} = fields;
  if (branch && targets) startDeploy({stack, branch, targets});
}

const config = {
  initialState: {branch: undefined, targets: undefined},
  shouldResetFormOnProps: ({stack}, nextProps) => {
    if (nextProps.stack !== stack) return true;
    if (nextProps.state.isSubmitting) return false;
    return true;
  },
  handlers: {
    selectStack({loadDeploys}) {
      return ({value}) => loadDeploys(value);
    },
    updateBranch({updateForm}) {
      return ({value}) => {
        updateForm(state => ({...state, branch: value}));
      };
    },
    updateTargets({updateForm}) {
      return targets => {
        updateForm(state => ({...state, targets: targets.map(target => target.value)}));
      };
    }
  }
};

export default connectForm(formName, ['branch', 'targets'], onSubmit, config)(DeploySettings);
