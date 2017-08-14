import React from 'react';
import PropTypes from 'prop-types';
import {connectForm} from 'redux-formalize';
import cx from 'classnames';
import Header from '../ui/Header';
import Button from '../ui/Button';
import {centre, content} from '../ui/Header.css';
import {header, button, root} from './Login.css';
import {form as formStyles, button as baseButton, cta} from '../ui/Form.css';
import errorStyles from '../ui/error.css';
import {formName} from './actions';

export function Login({fields: {email, password}, updateField, submitForm, state: {error, isSubmitting}}) {
  return (
    <div className={root}>
      <Header className={cx(header, centre)}>
        <form className={cx(formStyles, content)} onSubmit={submitForm} onChange={updateField}>
          <p>
            <label htmlFor="username">Email</label>
            <input name="email" type="email" value={email} autoFocus/>
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" value={password}/>
          </p>
          {error && <p className={errorStyles.root}>{error.message}</p>}
          <p>
            <Button type="submit" isLoading={isSubmitting} className={cx(baseButton, cta, button)}>Log in</Button>
          </p>
        </form>
      </Header>
    </div>
  );
}

Login.propTypes = {
  fields: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  state: PropTypes.object
};

function onSubmit({login, fields: {email, password}}) {
  if (email && password) login({username: email, password});
}

export default connectForm(formName, ['email', 'password'], onSubmit)(Login);
