import styled from 'styled-components';
import {middleable} from '.';
import RemoveIcon from '../icon/RemoveIcon';

// prettier-ignore
const RemoveButton = styled(RemoveIcon).attrs({title: 'Remove'})`
  ${middleable}

  width: 30px;
  height: 30px;
  
  &::before,
  &::after {
    width: 30px !important;
    top: 15px !important;
    left: 0 !important;
    background: var(--color-red-25) !important;
  }
  
  &:hover::before,
  &:hover::after {
    background: var(--color-red-35) !important;
  }
`;

export default RemoveButton;
