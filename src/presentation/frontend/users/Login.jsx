import React, {PropTypes} from 'react';
import configureForm from '../utils/form';
import cx from 'classnames';
import Header from '../ui/Header';
import {centre, content} from '../ui/Header.css';
import {header, button} from './Login.css';
import {form as formStyles, button as baseButton, cta} from '../ui/Form.css';
import {root} from '../ui/error.css';

const form = configureForm(['email', 'password'], ({login, form: {email, password}}) => {
  if (email && password) login(email, password);
});

function Login({form: {email, password}, updateEmail, updatePassword, submitForm, error}) {
  return (
    <Header className={cx(header, centre)}>
      <form className={cx(formStyles, content)} onSubmit={submitForm}>
        <p>
          <label htmlFor="username">Email</label>
          <input type="email" value={email} onChange={updateEmail} autoFocus/>
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input type="password" value={password} onChange={updatePassword}/>
        </p>
        {error && <p className={root}>{error.message}</p>}
        <p>
          <button type="submit" className={cx(baseButton, cta, button)}>Log in</button>
        </p>
      </form>
    </Header>
  );
}

Login.propTypes = {
  form: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  error: PropTypes.object
};

export default form(Login);
