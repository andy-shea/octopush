import React from 'react';
import PropTypes from 'prop-types';
import withHandlers from 'recompose/withHandlers';
import cx from 'classnames';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import Terminal from './Terminal';
import Hosts from './Hosts';
import {root, isActive, header, footer, time, user, naviconButton, navicon} from './DeployRow.css';

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
        <Hosts hosts={deploy.hosts} diff={diff}/>
      </header>
      <Terminal log={deploy.log}/>
      <footer className={footer}>
        <p>Deployed <b className={time} title={format(deploy.createdAt)}>{distanceInWordsToNow(deploy.createdAt, {includeSeconds: true})} ago</b></p>
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
