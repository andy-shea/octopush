import React, {SFC} from 'react';
import styled, {keyframes} from 'styled-components';

const loaderAnimation = keyframes`
  0%,
  80%,
  100% {
    box-shadow: 0 2em 0 -1.3em var(--color-grey-15);
  }
  40% {
    box-shadow: 0 2em 0 0 var(--color-grey-15);
  }
`;

const StyledPageLoader = styled.div`
  &::before,
  &::after,
  & {
    border-radius: 50%;
    width: 2em;
    height: 2em;
    animation: ${loaderAnimation} 1.8s infinite ease-in-out;
    animation-fill-mode: both;
  }

  margin-bottom: 3em;
  transform: translateX(2.5em);
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  animation-delay: 0.16s;

  &::before {
    left: -3em;
  }

  &::after {
    left: 3em;
    animation-delay: 0.32s;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
  }
`;

interface PageLoaderProps {
  className?: string;
}

const PageLoader: SFC<PageLoaderProps> = ({className}) => {
  return <StyledPageLoader className={className}>Loading...</StyledPageLoader>;
};

export default PageLoader;
