import styled from 'styled-components';

const RemoveIcon = styled.span`
  z-index: 100;
  display: block;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  text-indent: -119988px;
  text-align: left;
  text-transform: capitalize;

  &::before,
  &::after {
    display: block;
    content: '';
    height: 1px;
    width: 40px;
    background: #fff;
    position: absolute;
    top: 24px;
    left: 5px;
  }

  &::before {
    transform: rotate(-45deg);
  }
  &::after {
    transform: rotate(45deg);
  }
`;

export default RemoveIcon;
