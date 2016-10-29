import React, {PropTypes} from 'react';
import Select from 'react-select';
import configureForm from '../utils/form';
import Button from '../ui/Button';
import {root, textField} from '../ui/SaveEntityForm.css';

function onSubmit({form, group, saveGroup}) {
  const name = form.name.trim();
  const selectedServers = form.selectedServers.split(',');
  if (name && selectedServers) saveGroup(group, name, selectedServers);
}

function initialState({group}) {
  if (group) {
    const {name, servers: serverIds} = group;
    return {name, selectedServers: serverIds ? serverIds.join(',') : null};
  }
  return {name: '', selectedServers: null};
}

const form = configureForm(['selectedServers', 'name'], onSubmit, {initialState});

function SaveGroupForm({meta, servers, group, form: {selectedServers, name}, updateSelectedServers, updateName, submitForm}) {
  const options = servers ? Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname})) : [];
  return (
    <form onSubmit={submitForm}>
      <Select name="servers" instanceId="servers" options={options} multi placeholder="Servers" simpleValue value={selectedServers} onChange={updateSelectedServers}/>
      <div className={root}>
        <input className={textField} placeholder="Name" value={name} onChange={updateName}/>
        <Button type="submit" isLoading={meta.isSaving}>{group.id ? 'Save' : 'Add'}</Button>
      </div>
    </form>
  );
}

SaveGroupForm.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    selectedServers: PropTypes.string
  }).isRequired,
  saveGroup: PropTypes.func.isRequired,
  updateSelectedServers: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  group: PropTypes.object,
  servers: PropTypes.object,
  meta: PropTypes.object
};

export default form(SaveGroupForm);
