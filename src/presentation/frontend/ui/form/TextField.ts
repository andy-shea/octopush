import styled, {css} from 'styled-components';

interface TextFieldProps {
  first?: boolean;
}

// prettier-ignore
const TextField = styled.input.attrs<TextFieldProps>({type: 'text'})`
  padding: 6px 15px;
  display: block;
  line-height: 34px;
  font-size: 1.1em;
  border: 1px solid var(--color-red-10);
  width: 100%;
  background-color: var(--color-light-red);

  ${({first}: TextFieldProps) => first && css`
    border-bottom: none;
  `}
`;

export default TextField;
