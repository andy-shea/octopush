import React from 'react';
import PropTypes from 'prop-types';
import Reform, {Form} from 'reformist';
import Button from '../ui/form/Button';
import FieldGroup from '../ui/form/FieldGroup';
import TextField from '../ui/form/TextField';
import Error from '../ui/form/Error';

function submitForm({saveServer, setSubmitting, resetForm, setErrors, values}) {
  const hostname = values.hostname.trim();
  if (hostname) saveServer({hostname}, {resetForm, setErrors});
  else setSubmitting(false);
}

export function SaveServerForm({server, saveServer}) {
  const initialState = {hostname: server ? server.hostname : ''};
  return (
    <Reform
      key={initialState.hostname}
      initialState={initialState}
      saveServer={saveServer}
      submitForm={submitForm}
    >
      {({values, errors, onChange, isSubmitting}) => (
        <Form data-testid="server-form">
          <FieldGroup>
            <TextField
              placeholder="Hostname"
              name="hostname"
              value={values.hostname}
              onChange={onChange}
              autoFocus
            />
            <Button type="submit" isLoading={isSubmitting}>
              {server ? 'Save' : 'Add'}
            </Button>
          </FieldGroup>
          {errors.hostname && <Error>{errors.hostname}</Error>}
          {errors._other && <Error>{errors._other}</Error>}
        </Form>
      )}
    </Reform>
  );
}

SaveServerForm.propTypes = {
  saveServer: PropTypes.func.isRequired,
  server: PropTypes.object
};

export default SaveServerForm;
