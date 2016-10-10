import React, {Component, PropTypes} from 'react';
import autobind from 'autobind-decorator';
import {withRouter} from 'react-router';
import cx from 'classnames';
import StackSelect from './StackSelect';
import BranchSelect from './BranchSelect';
import TargetsSelect from './TargetsSelect';
import Header from '../ui/Header';
import {button, large, cta} from '../ui/Form.css';
import {content} from '../ui/Header.css';
import {deployButton, stackSelectWrap, deploy} from './DeploySettings.css';

@withRouter
class DeploySettings extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
    startDeploy: PropTypes.func.isRequired,
    branches: PropTypes.array,
    stack: PropTypes.object,
    stacks: PropTypes.object,
    servers: PropTypes.object
  }

  state = {branch: undefined, targets: undefined}

  componentWillReceiveProps(nextProps) {
    if (nextProps.stack !== this.props.stack) this.clearTargets();
  }

  clearTargets() {
    this.setState({branch: undefined, targets: undefined});
  }

  @autobind
  selectStack({value}) {
    this.props.router.push(`/${value}`);
  }

  @autobind
  selectBranch({value}) {
    this.setState({branch: value});
  }

  @autobind
  selectTargets(targets) {
    this.setState({targets: targets.map(target => target.value)});
  }

  @autobind
  startDeployWithStack() {
    const {startDeploy, stack} = this.props;
    const {branch, targets} = this.state;
    startDeploy(stack, branch, targets);
    this.clearTargets();
  }

  render() {
    const {stack, stacks, servers, branches} = this.props;
    const {branch, targets} = this.state;

    return (
      <Header>
        <div className={cx(content, stackSelectWrap)}>
          <StackSelect stacks={stacks} selected={stack} selectStack={this.selectStack}/>
        </div>
        {stack && <div className={deploy}>
          <BranchSelect branches={branches} selectBranch={this.selectBranch} selectedBranch={branch}/>
          to
          <TargetsSelect groups={stack.groups} servers={servers} selectTargets={this.selectTargets} selectedTargets={targets}/>
          <button className={cx(button, large, cta, deployButton)} onClick={this.startDeployWithStack}>Deploy!</button>
        </div>}
      </Header>
    );
  }

}

export default DeploySettings;
