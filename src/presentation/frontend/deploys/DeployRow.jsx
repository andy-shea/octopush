import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import autobind from 'autobind-decorator';
import moment from 'moment';
import Terminal from './Terminal';
import {root, isActive, header, servers, footer, time, user, naviconButton, navicon} from './DeployRow.css';

function diffUrl(diff, revFrom, revTo) {
  return diff.replace('{{from}}', revFrom).replace('{{to}}', revTo);
}

class DeployRow extends Component {

  static propTypes = {
    deploy: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    diff: PropTypes.string.isRequired,
    toggleDeployDetails: PropTypes.func.isRequired
  }

  @autobind
  expandDeploy(e) {
    const {deploy, toggleDeployDetails} = this.props;
    if (e.target === findDOMNode(this.refs.toggleDeployButton) || !deploy.isExpanded) {
      toggleDeployDetails(deploy);
    }
  }

  @autobind
  viewDiff(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open(findDOMNode(this.refs.diffLink).href);
  }

  render() {
    const {diff, deploy, user: {name}} = this.props;
    return (
      <article className={cx(root, {[isActive]: deploy.isExpanded})} onClick={this.expandDeploy}>
        <header className={cx(header, 'clearfix')}>
          <h1>{deploy.branch}</h1>
          <ul className={servers}>
            {deploy.hosts.map(host => (
              <li key={host.name}>
                {host.name}
                {
                  host.revisionFrom && diff &&
                  <a ref="diffLink" href={diffUrl(diff, host.revisionFrom, host.revisionTo)} onClick={this.viewDiff}>
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
        <span ref="toggleDeployButton" className={naviconButton}><i className={navicon}/></span>
      </article>
    );
  }

}

export default DeployRow;
