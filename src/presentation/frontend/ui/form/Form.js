import styled from 'styled-components';

const Form = styled.form`
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

export default Form;
