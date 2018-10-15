import React from 'react';
import styled from 'styled-components';

const StyledIcon = styled.svg`
  width: 40px;
  height: 40px;
  background-color: var(--color-red);
  stroke-width: 1px;
  fill: transparent;
  margin: 5px;
`;

interface IconProps {
  type: string;
  className?: string;
}

const Icon: React.SFC<IconProps> = ({className, type, ...props}) => {
  return (
    <StyledIcon
      className={className}
      dangerouslySetInnerHTML={{__html: `<use xlink:href="#${type}"/>`}}
      {...props}
    />
  );
};

export default Icon;
