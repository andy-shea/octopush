import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuSelect from '../ui/form/MenuSelect';
import {connectForm} from 'redux-formalize';
import Button from '../ui/form/Button';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import GroupsContainer from './GroupsContainer';
import SettingsPaneContent from '../ui/menu/SettingsPaneContent';
import FieldGroup from '../ui/form/FieldGroup';
import TextField from '../ui/form/TextField';
import CloseIcon from '../ui/icon/CloseIcon';
import {stackFormName} from './actions';

const StyledStackDetail = styled.div`
  height: 100%;
`;

export function StackDetail({state, stack, servers, editStack, fields, updateField, submitForm, updateSelectedServers}) {
  const {title, gitPath, selectedServers, diff} = fields;
  const options = Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname}));
  return (
    <StyledStackDetail>
      <CloseIcon title="Close settings" onClick={editStack}>Close settings</CloseIcon>
      <h2>{stack.title || 'New Stack'}</h2>
      <MenuScrollPane width={600}>
        <SettingsPaneContent>
          <form onSubmit={submitForm} onChange={updateField}>
            <TextField first placeholder="Title" name="title" value={title} autoFocus/>
            <TextField first placeholder="Git Path" name="gitPath" value={gitPath}/>
            <MenuSelect name="servers" instanceId="whitelist" options={options} isMulti placeholder="Server Whitelist" simpleValue
              value={selectedServers} onChange={updateSelectedServers}/>
            <FieldGroup>
              <TextField placeholder="Diff URL" name="diff" value={diff}/>
              <Button type="submit" isLoading={state.isSubmitting}>{stack.id ? 'Save' : 'Add'}</Button>
            </FieldGroup>
          </form>
        </SettingsPaneContent>

        {stack.id && <GroupsContainer/>}
      </MenuScrollPane>
    </StyledStackDetail>
  );
}

StackDetail.propTypes = {
  fields: PropTypes.shape({
    title: PropTypes.string.isRequired,
    gitPath: PropTypes.string.isRequired,
    selectedServers: PropTypes.string,
    diff: PropTypes.string
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateSelectedServers: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  servers: PropTypes.object.isRequired,
  editStack: PropTypes.func.isRequired,
  saveStack: PropTypes.func.isRequired,
  stack: PropTypes.object,
  state: PropTypes.object
};

function onSubmit({fields, stack, saveStack}) {
  const title = fields.title.trim();
  const gitPath = fields.gitPath.trim();
  const diff = fields.diff && fields.diff.trim();
  const selectedServers = fields.selectedServers.split(',');
  if (title && gitPath && selectedServers) saveStack(stack, title, gitPath, selectedServers, diff);
}

const config = {
  initialState({stack}) {
    if (stack) {
      const {title, gitPath, diff, servers: serverIds} = stack;
      return {title, gitPath, diff, selectedServers: serverIds ? serverIds.join(',') : null};
    }
    return {title: '', gitPath: '', diff: '', selectedServers: null};
  },
  handlers: {
    editStack: props => () => props.editStack(null),
    updateSelectedServers({updateForm}) {
      return selectedServers => updateForm(state => ({...state, selectedServers}));
    }
  }
};

export default connectForm(stackFormName, ['title', 'gitPath', 'selectedServers', 'diff'], onSubmit, config)(StackDetail);
