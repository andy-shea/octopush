import React, {PropTypes} from 'react';
import configureForm from '../utils/form';
import Button from '../ui/Button';
import {root, textField} from '../ui/SaveEntityForm.css';

function onSubmit({saveServer, form}) {
  const hostname = form.hostname.trim();
  if (hostname) saveServer(hostname);
}

function initialState({server}) {
  return {hostname: server ? server.hostname : ''};
}

const form = configureForm(['hostname'], onSubmit, {initialState});

function SaveServerForm({formState, server, form: {hostname}, updateHostname, submitForm}) {
  return (
    <form className={root} onSubmit={submitForm}>
      <input className={textField} placeholder="Hostname" value={hostname} onChange={updateHostname} autoFocus/>
      <Button type="submit" isLoading={formState.isSaving}>{server ? 'Save' : 'Add'}</Button>
    </form>
  );
}

SaveServerForm.propTypes = {
  form: PropTypes.shape({
    hostname: PropTypes.string.isRequired
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateHostname: PropTypes.func.isRequired,
  saveServer: PropTypes.func.isRequired,
  formState: PropTypes.object,
  server: PropTypes.object
};

export default form(SaveServerForm);
