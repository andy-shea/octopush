import React from 'react';
import PropTypes from 'prop-types';
import {connectForm} from 'redux-formalize';
import styled from 'styled-components';
import Header from '../ui/Header';
import Form from '../ui/form/Form';
import Button from '../ui/form/Button';
import Error from '../ui/form/Error';
import {formName} from './actions';

const StyledLogin = styled.div`
  background: var(--color-grey);
  width: 100%;
  height: 100%;
`;

const LoginHeader = styled(Header)`
  padding: 1% 2% 100px;
`;

const LoginForm = styled(Form)`
  margin-left: 20%;
`;

const LoginButton = styled(Button)`
  padding-top: 6px;
  padding-bottom: 6px;
`;

export function Login({fields: {email, password}, updateField, submitForm, state: {error, isSubmitting}}) {
  return (
    <StyledLogin>
      <LoginHeader centred>
        <LoginForm onSubmit={submitForm} onChange={updateField}>
          <p>
            <label htmlFor="username">Email</label>
            <input name="email" type="email" value={email} autoFocus/>
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" value={password}/>
          </p>
          {error && <Error>{error.message}</Error>}
          <p>
            <LoginButton type="submit" isLoading={isSubmitting} cta>Log in</LoginButton>
          </p>
        </LoginForm>
      </LoginHeader>
    </StyledLogin>
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
