import React from 'react';
import PropTypes from 'prop-types';
import {connectForm} from 'redux-formalize';
import Button from '../ui/Button';
import {root, textField} from '../ui/SaveEntityForm.css';
import {formName} from './actions';

export function SaveServerForm({server, fields: {hostname}, updateField, submitForm, state: {isSubmitting}}) {
  return (
    <form className={root} onSubmit={submitForm} onChange={updateField}>
      <input className={textField} placeholder="Hostname" name="hostname" value={hostname} autoFocus/>
      <Button type="submit" isLoading={isSubmitting}>{server ? 'Save' : 'Add'}</Button>
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
