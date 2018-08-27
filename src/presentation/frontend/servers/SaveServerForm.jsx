import React from 'react';
import PropTypes from 'prop-types';
import {connectForm} from 'redux-formalize';
import Button from '../ui/form/Button';
import FieldGroup from '../ui/form/FieldGroup';
import TextField from '../ui/form/TextField';
import {formName} from './actions';

export function SaveServerForm({server, fields: {hostname}, updateField, submitForm, state: {isSubmitting}}) {
  return (
    <form onSubmit={submitForm} onChange={updateField}>
      <FieldGroup>
        <TextField placeholder="Hostname" name="hostname" value={hostname} autoFocus/>
        <Button type="submit" isLoading={isSubmitting}>{server ? 'Save' : 'Add'}</Button>
      </FieldGroup>
    </form>
  );
}

SaveServerForm.propTypes = {
  fields: PropTypes.shape({
    hostname: PropTypes.string.isRequired
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  saveServer: PropTypes.func.isRequired,
  state: PropTypes.object,
  server: PropTypes.object
};

function onSubmit({saveServer, fields}) {
  const hostname = fields.hostname.trim();
  if (hostname) saveServer(hostname);
}

const config = {
  initialState({server}) {
    return {hostname: server ? server.hostname : ''};
  }
};

export default connectForm(formName, ['hostname'], onSubmit, config)(SaveServerForm);
