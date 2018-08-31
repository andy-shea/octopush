import React from 'react';
import PropTypes from 'prop-types';
import MenuSelect from '../ui/form/MenuSelect';
import Reform, {Form} from 'reformist';
import Button from '../ui/form/Button';
import FieldGroup from '../ui/form/FieldGroup';
import TextField from '../ui/form/TextField';
import Error from '../ui/form/Error';

function submitForm({group, saveGroup, setSubmitting, resetForm, setErrors, values}) {
  const name = values.name.trim();
  const servers = values.servers.map(option => parseInt(option.value, 10));
  if (name && servers.length) saveGroup({group, name, servers}, {resetForm, setErrors});
  else setSubmitting(false);
}

export function SaveGroupForm({servers, group, saveGroup}) {
  const options = servers
    ? Object.keys(servers).reduce((carry, id) => {
      carry[id] = {value: id.toString(), label: servers[id].hostname};
      return carry;
    }, {})
    : {};
  const initialState = {
    name: group ? group.name : '',
    servers: group && group.servers ? group.servers.map(value => options[value]) : []
  };
  return (
    <Reform
      key={initialState.name}
      initialState={initialState}
      group={group}
      saveGroup={saveGroup}
      submitForm={submitForm}
    >
      {({values, errors, onChange, updateValue, isSubmitting}) => (
        <Form>
          <MenuSelect
            id="servers"
            name="servers"
            instanceId="servers"
            options={Object.values(options)}
            isMulti
            placeholder="Servers"
            value={values.servers}
            updateValue={updateValue}
          />
          {errors.servers && <label htmlFor="servers">{errors.servers}</label>}
          <FieldGroup>
            <TextField
              placeholder="Name"
              id="name"
              name="name"
              value={values.name}
              onChange={onChange}
            />
            <Button type="submit" isLoading={isSubmitting}>
              {group.id ? 'Save' : 'Add'}
            </Button>
          </FieldGroup>
          {errors.name && <label htmlFor="name">{errors.name}</label>}
          {errors._other && <Error>{errors._other}</Error>}
        </Form>
      )}
    </Reform>
  );
}

SaveGroupForm.propTypes = {
  saveGroup: PropTypes.func.isRequired,
  group: PropTypes.object,
  servers: PropTypes.object
};

export default SaveGroupForm;
