import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledIcon = styled.svg`
  width: 40px;
  height: 40px;
  stroke: #fff;
  stroke-width: 1px;
  fill: transparent;
  margin: 5px;
`;

function Icon({className, type, ...props}) {
  return <StyledIcon className={className} dangerouslySetInnerHTML={{__html: `<use xlink:href="#${type}"/>`}} {...props}/>
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Icon;
