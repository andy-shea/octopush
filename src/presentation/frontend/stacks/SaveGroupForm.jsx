import React from 'react';
import PropTypes from 'prop-types';
import MenuSelect from '../ui/form/MenuSelect';
import {connectForm} from 'redux-formalize';
import Button from '../ui/form/Button';
import FieldGroup from '../ui/form/FieldGroup';
import TextField from '../ui/form/TextField';
import {groupFormName} from './actions';

export function SaveGroupForm({state, servers, group, fields, updateField, updateSelectedServers, submitForm}) {
  const {selectedServers, name} = fields;
  const options = servers ? Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname})) : [];
  return (
    <form onSubmit={submitForm} onChange={updateField}>
      <MenuSelect name="servers" instanceId="servers" options={options} isMulti placeholder="Servers"
        simpleValue value={selectedServers} onChange={updateSelectedServers}/>
      <FieldGroup>
        <TextField placeholder="Name" name="name" value={name}/>
        <Button type="submit" isLoading={state.isSubmitting}>{group.id ? 'Save' : 'Add'}</Button>
      </FieldGroup>
    </form>
  );
}

SaveGroupForm.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string.isRequired,
    selectedServers: PropTypes.string
  }).isRequired,
  saveGroup: PropTypes.func.isRequired,
  updateSelectedServers: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  group: PropTypes.object,
  servers: PropTypes.object,
  state: PropTypes.object
};

function onSubmit({fields, group, saveGroup}) {
  const name = fields.name.trim();
  const selectedServers = fields.selectedServers.split(',');
  if (name && selectedServers) saveGroup(group, name, selectedServers);
}

const config = {
  initialState({group}) {
    if (group) {
      const {name, servers: serverIds} = group;
      return {name, selectedServers: serverIds ? serverIds.join(',') : null};
    }
    return {name: '', selectedServers: null};
  },
  handlers: {
    updateSelectedServers({updateForm}) {
      return selectedServers => updateForm(state => ({...state, selectedServers}));
    }
  }
};

export default connectForm(groupFormName, ['selectedServers', 'name'], onSubmit, config)(SaveGroupForm);
