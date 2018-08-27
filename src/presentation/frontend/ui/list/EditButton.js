import styled from 'styled-components';
import {middleable} from '.';
import Icon from '../icon/Icon';

// prettier-ignore
const EditButton = styled(Icon).attrs({title: 'Edit', type: 'edit'})`
  ${middleable}

  width: 32px !important;
  height: 32px !important;
  stroke: var(--color-red-25) !important;
  cursor: pointer;
  margin: 0;

  &:hover {
    stroke: var(--color-red-35) !important;
  }
`;

export default EditButton;
