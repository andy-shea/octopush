import React, {PropTypes} from 'react';
import withHandlers from 'recompose/withHandlers';
import cx from 'classnames';
import moment from 'moment';
import Terminal from './Terminal';
import {root, isActive, header, servers, footer, time, user, naviconButton, navicon} from './DeployRow.css';

function diffUrl(diff, revFrom, revTo) {
  return diff.replace('{{from}}', revFrom).replace('{{to}}', revTo);
}

function viewDiff(e) {
  e.preventDefault();
  e.stopPropagation();
  window.open(e.target.href);
}

const handlers = withHandlers({
  toggleDeployDetails: props => e => {
    props.toggleDeployDetails(props.deploy, e);
  }
});

function DeployRow({diff, deploy, user: {name}, toggleDeployDetails}) {
  return (
    <article className={cx(root, {[isActive]: deploy.isExpanded})} onClick={toggleDeployDetails}>
      <header className={cx(header, 'clearfix')}>
        <h1>{deploy.branch}</h1>
        <ul className={servers}>
          {deploy.hosts.map(host => (
            <li key={host.name}>
              {host.name}
              {
                host.revisionFrom && diff &&
                <a href={diffUrl(diff, host.revisionFrom, host.revisionTo)} onClick={viewDiff}>
                  [{host.revisionFrom} → {host.revisionTo}]
                </a>
              }
            </li>
          ))}
        </ul>
      </header>
      <Terminal log={deploy.log}/>
      <footer className={footer}>
        <p>Deployed <b className={time}>{moment(deploy.createdAt).fromNow()}</b></p>
        <p>by <i className={user}>{name}</i></p>
      </footer>
      <span className={cx(naviconButton, 'toggle-deploy-btn')}>
        <i className={cx(navicon, 'toggle-deploy-btn')}/>
      </span>
    </article>
  );
}

DeployRow.propTypes = {
  deploy: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  toggleDeployDetails: PropTypes.func.isRequired,
  diff: PropTypes.string
};

export default handlers(DeployRow);
