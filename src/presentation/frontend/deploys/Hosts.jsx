import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function diffUrl(diff, revFrom, revTo) {
  return diff.replace('{{from}}', revFrom).replace('{{to}}', revTo);
}

const Rev = styled.a`
  font-weight: normal;
  color: var(--color-grey-30);
  text-decoration: none;
  transition: color 0.1s;
  margin-left: 0.3em;

  &:hover {
    color: var(--color-blue-10);
  }
`;

function renderDiff(revisionFrom, revisionTo, diff) {
  const revChange = revisionFrom && `[${revisionFrom} → ${revisionTo}]`;
  return <Rev href={diffUrl(diff, revisionFrom, revisionTo)} target="_blank">{revChange}</Rev>;
}

const HostsList = styled.ul`
  font-size: 0.9em;
  list-style: none;
  margin: 1px 0 0;
  padding: 0;
  min-height: 1.3em;

  & li {
    float: left;
    margin-right: 2em;
    font-weight: bold;
    color: var(--color-blue);
  }
`;

function Hosts({hosts, diff}) { // eslint-disable-line react/no-multi-comp
  return (
    <HostsList>
      {hosts.map(({name, revisionFrom, revisionTo}) => (
        <li key={name}>
          {name}
          {revisionFrom && renderDiff(revisionFrom, revisionTo, diff)}
        </li>
      ))}
    </HostsList>
  );
}

Hosts.propTypes = {
  hosts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    revisionFrom: PropTypes.string,
    revisionTo: PropTypes.string
  })).isRequired,
  diff: PropTypes.string
};

export default Hosts;
