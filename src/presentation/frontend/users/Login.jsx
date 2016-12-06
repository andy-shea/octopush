import React, {PropTypes} from 'react';
import configureForm from '../utils/form';
import cx from 'classnames';
import Header from '../ui/Header';
import Button from '../ui/Button';
import {centre, content} from '../ui/Header.css';
import {header, button, root} from './Login.css';
import {form as formStyles, button as baseButton, cta} from '../ui/Form.css';
import errorStyles from '../ui/error.css';

const form = configureForm(['email', 'password'], ({login, form: {email, password}}) => {
  if (email && password) login(email, password);
});

function Login({form: {email, password}, updateEmail, updatePassword, submitForm, formState: {error, isActioning}}) {
  return (
    <div className={root}>
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
          {error && <p className={errorStyles.root}>{error.message}</p>}
          <p>
            <Button type="submit" isLoading={isActioning} className={cx(baseButton, cta, button)}>Log in</Button>
          </p>
        </form>
      </Header>
    </div>
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
  formState: PropTypes.object
};

export default form(Login);
