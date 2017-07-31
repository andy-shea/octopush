import React from 'react';
import PropTypes from 'prop-types';
import {root, rev} from './Hosts.css';

function diffUrl(diff, revFrom, revTo) {
  return diff.replace('{{from}}', revFrom).replace('{{to}}', revTo);
}

function viewDiff(e) {
  e.preventDefault();
  e.stopPropagation();
  window.open(e.target.href);
}

function renderDiff(revisionFrom, revisionTo, diff) {
  const revChange = revisionFrom && `[${revisionFrom} → ${revisionTo}]`;
  return diff
    ? <a className={rev} href={diffUrl(diff, revisionFrom, revisionTo)} onClick={viewDiff}>{revChange}</a>
    : <span className={rev}>{revChange}</span>;
}

function Hosts({hosts, diff}) { // eslint-disable-line react/no-multi-comp
  return (
    <ul className={root}>
      {hosts.map(({name, revisionFrom, revisionTo}) => (
        <li key={name}>
          {name}
          {revisionFrom && renderDiff(revisionFrom, revisionTo, diff)}
        </li>
      ))}
    </ul>
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
