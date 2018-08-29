import styled, {css} from 'styled-components';

// prettier-ignore
const TextField = styled.input`
  padding: 6px 15px;
  display: block;
  line-height: 34px;
  font-size: 1.1em;
  border: 1px solid var(--color-red-10);
  width: 100%;
  background-color: var(--color-light-red);

  ${({first}) => first && css`
    border-bottom: none;
  `}
`;

export default TextField;
