import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {withHandlers} from 'recompose';
import Reform, {Form} from 'reformist';
import Button from '../ui/form/Button';
import StackSelect from './StackSelect';
import BranchSelect from './BranchSelect';
import TargetsSelect from './TargetsSelect';
import Header from '../ui/Header';
import Error from '../ui/form/Error';

const DeployButton = styled(Button).attrs({type: 'submit', cta: true, large: true})`
  padding-top: 7px !important;
  padding-bottom: 7px !important;
  transform: translateY(-1px);
`;

const StackSelectWrapper = styled.div`
  width: 300px;
  margin-left: 20%;
`;

const DeployForm = styled(Form)`
  border-bottom: 1px solid var(--color-grey-10);
  padding: 20px 20px 30px 20%;
  margin-top: 1em;
  position: relative;

  &::before {
    position: absolute;
    color: var(--color-grey-30);
    text-transform: uppercase;
    font-size: 0.7em;
    content: 'Deploy:';
    top: 0;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  align-items: center;
`;

const enhance = withHandlers({
  selectStack({loadDeploys, stack}) {
    return ({value}) => {
      if (stack.slug !== value) loadDeploys(value);
    };
  }
});

function submitForm({stack, startDeploy, setSubmitting, resetForm, setErrors, values}) {
  const branch = values.branch && values.branch.value;
  const targets = values.targets && values.targets.map(({value}) => value);
  if (branch && targets.length) {
    startDeploy({slug: stack.slug, branch, targets}, {onSuccess: resetForm, setErrors});
  } else setSubmitting(false);
}

export function DeploySettings({startDeploy, stack, stacks, servers, branches, selectStack}) {
  return (
    <Header>
      <StackSelectWrapper>
        <StackSelect stacks={stacks} selected={stack} selectStack={selectStack} />
      </StackSelectWrapper>
      {stack && (
        <Reform
          key={stack.slug}
          initialState={{branch: null, targets: null}}
          startDeploy={startDeploy}
          stack={stack}
          submitForm={submitForm}
        >
          {({values, errors, updateValue, isSubmitting}) => (
            <DeployForm>
              <FieldGroup>
                <BranchSelect
                  branches={branches}
                  selectedBranch={values.branch}
                  updateValue={updateValue}
                />
                to
                <TargetsSelect
                  groups={stack.groups}
                  servers={servers}
                  selectedTargets={values.targets}
                  updateValue={updateValue}
                />
                <DeployButton isLoading={isSubmitting}>Deploy!</DeployButton>
              </FieldGroup>
              {errors.branches && <label htmlFor="branches">{errors.branches}</label>}
              {errors.targets && <label htmlFor="targets">{errors.targets}</label>}
              {errors._other && <Error>{errors._other}</Error>}
            </DeployForm>
          )}
        </Reform>
      )}
    </Header>
  );
}

DeploySettings.propTypes = {
  startDeploy: PropTypes.func.isRequired,
  selectStack: PropTypes.func.isRequired,
  branches: PropTypes.array,
  stack: PropTypes.object,
  stacks: PropTypes.object,
  servers: PropTypes.object
};

export default enhance(DeploySettings);
