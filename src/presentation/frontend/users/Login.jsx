import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Header from '../ui/Header';
import Reform, {Form} from 'reformist';
import Button from '../ui/form/Button';
import Error from '../ui/form/Error';

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

  & p {
    margin: 0 0 1.5em;
  }

  & label {
    text-transform: uppercase;
    font-size: 0.7em;
    color: var(--color-grey-30);
  }
  & label::after {
    content: ':';
  }

  & input[type='text'],
  & input[type='email'],
  & input[type='password'],
  & textarea {
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    outline: none;
    border-bottom: 1px solid var(--color-grey-20);
    font-size: 18px;
    width: 100%;
    max-width: 400px;
    display: block;
  }
`;

const LoginButton = styled(Button)`
  padding-top: 6px;
  padding-bottom: 6px;
`;

function submitForm({login, setErrors, values: {email, password}}) {
  login({username: email, password}, {setErrors});
}

export function Login({login}) {
  return (
    <StyledLogin>
      <LoginHeader centred>
        <Reform initialState={{email: '', password: ''}} login={login} submitForm={submitForm}>
          {({values, errors, onChange, isSubmitting}) => (
            <LoginForm>
              <p>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={onChange}
                  autoFocus
                />
                {errors.email && <label htmlFor="email">{errors.email}</label>}
              </p>
              <p>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={onChange}
                />
                {errors.password && <label htmlFor="password">{errors.password}</label>}
              </p>
              {errors._other && <Error>{errors._other}</Error>}
              <p>
                <LoginButton type="submit" isLoading={isSubmitting} cta>
                  Log in
                </LoginButton>
              </p>
            </LoginForm>
          )}
        </Reform>
      </LoginHeader>
    </StyledLogin>
  );
}

Login.propTypes = {login: PropTypes.func.isRequired};

export default Login;
