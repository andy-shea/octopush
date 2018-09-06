import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {withHandlers} from 'recompose';
import MenuSelect from '../ui/form/MenuSelect';
import Reform, {Form} from 'reformist';
import Button from '../ui/form/Button';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import GroupsContainer from './GroupsContainer';
import SettingsPaneContent from '../ui/menu/SettingsPaneContent';
import FieldGroup from '../ui/form/FieldGroup';
import TextField from '../ui/form/TextField';
import CloseIcon from '../ui/icon/CloseIcon';
import Error from '../ui/form/Error';

const StyledStackDetail = styled.div`
  height: 100%;
`;

const enhance = withHandlers({
  editStack: props => () => props.editStack({stack: null})
});

function submitForm({stack, saveStack, setSubmitting, setErrors, values}) {
  const title = values.title.trim();
  const gitPath = values.gitPath.trim();
  const servers = values.servers.map(option => parseInt(option.value, 10));
  if (title && gitPath && servers.length) {
    const payload = {stack, title, gitPath, servers, diff: values.diff && values.diff.trim()};
    saveStack(payload, {setSubmitting, setErrors});
  }
  else setSubmitting(false);
}

export function StackDetail({stack, servers, saveStack, editStack}) {
  const options = Object.keys(servers).reduce((carry, id) => {
    carry[id] = {value: id.toString(), label: servers[id].hostname};
    return carry;
  }, {});
  const initialState = {
    title: stack ? stack.title : '',
    gitPath: stack ? stack.gitPath : '',
    diff: stack ? stack.diff : '',
    servers: stack && stack.servers.map(value => options[value])
  };
  return (
    <StyledStackDetail>
      <CloseIcon title="Close settings" onClick={editStack}>
        Close settings
      </CloseIcon>
      <h2>{stack.title || 'New Stack'}</h2>
      <MenuScrollPane width={600}>
        <SettingsPaneContent>
          <Reform
            initialState={initialState}
            stack={stack}
            saveStack={saveStack}
            submitForm={submitForm}
          >
            {({values, errors, onChange, updateValue, isSubmitting}) => (
              <Form data-testid="stack-form">
                <TextField
                  first
                  placeholder="Title"
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={onChange}
                  autoFocus
                />
                {errors.title && <label htmlFor="title">{errors.title}</label>}
                <TextField
                  first
                  placeholder="Git Path"
                  id="git-path"
                  name="gitPath"
                  value={values.gitPath}
                  onChange={onChange}
                />
                {errors.gitPath && <label htmlFor="git-path">{errors.gitPath}</label>}
                <MenuSelect
                  name="servers"
                  instanceId="whitelist"
                  options={Object.values(options)}
                  isMulti
                  placeholder="Server Whitelist"
                  value={values.servers}
                  updateValue={updateValue}
                />
                {errors.servers && <label htmlFor="servers">{errors.servers}</label>}
                <FieldGroup>
                  <TextField
                    placeholder="Diff URL"
                    name="diff"
                    value={values.diff}
                    onChange={onChange}
                  />
                  <Button type="submit" isLoading={isSubmitting}>
                    {stack.id ? 'Save' : 'Add'}
                  </Button>
                </FieldGroup>
                {errors.diff && <label htmlFor="diff">{errors.diff}</label>}
                {errors._other && <Error>{errors._other}</Error>}
              </Form>
            )}
          </Reform>
        </SettingsPaneContent>
        {stack.id && <GroupsContainer />}
      </MenuScrollPane>
    </StyledStackDetail>
  );
}

StackDetail.propTypes = {
  servers: PropTypes.object.isRequired,
  editStack: PropTypes.func.isRequired,
  saveStack: PropTypes.func.isRequired,
  stack: PropTypes.object
};

export default enhance(StackDetail);
