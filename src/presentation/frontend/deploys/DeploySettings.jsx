import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../ui/Button';
import configureForm from '../utils/form';
import StackSelect from './StackSelect';
import BranchSelect from './BranchSelect';
import TargetsSelect from './TargetsSelect';
import Header from '../ui/Header';
import {button, large, cta} from '../ui/Form.css';
import {content} from '../ui/Header.css';
import {deployButton, stackSelectWrap, deploy} from './DeploySettings.css';

function shouldResetFormOnProps({stack, clearTargets}, nextProps) {
  return (nextProps.stack !== stack);
}

function onSubmit({form, stack, startDeploy}) {
  const {branch, targets} = form;
  if (branch && targets) startDeploy({stack, branch, targets});
}

const handlers = {
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
};

const initialState = {branch: undefined, targets: undefined};
const form = configureForm(['branch', 'targets'], onSubmit, {initialState, shouldResetFormOnProps, handlers});

function DeploySettings({formState, stack, stacks, servers, branches, form: {branch, targets}, updateBranch, updateTargets, submitForm, selectStack}) {
  return (
    <Header>
      <div className={cx(content, stackSelectWrap)}>
        <StackSelect stacks={stacks} selected={stack} selectStack={selectStack}/>
      </div>
      {stack && <form className={deploy} onSubmit={submitForm}>
        <BranchSelect branches={branches} selectBranch={updateBranch} selectedBranch={branch}/>
        to
        <TargetsSelect groups={stack.groups} servers={servers} selectTargets={updateTargets} selectedTargets={targets}/>
        <Button type="submit" isLoading={formState.isSaving} className={cx(button, large, cta, deployButton)}>Deploy!</Button>
      </form>}
    </Header>
  );
}

DeploySettings.propTypes = {
  form: PropTypes.shape({
    branch: PropTypes.string,
    targets: PropTypes.array
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateBranch: PropTypes.func.isRequired,
  updateTargets: PropTypes.func.isRequired,
  startDeploy: PropTypes.func.isRequired,
  selectStack: PropTypes.func.isRequired,
  branches: PropTypes.array,
  stack: PropTypes.object,
  stacks: PropTypes.object,
  servers: PropTypes.object,
  formState: PropTypes.object
};

export default form(DeploySettings);
