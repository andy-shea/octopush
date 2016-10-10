import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import Select from 'react-select';
import cx from 'classnames';
import autobind from 'autobind-decorator';
import Button from '../ui/Button';
import MenuScrollPane from '../ui/MenuScrollPane';
import GroupsContainer from './GroupsContainer';
import styles from './StackDetail.css';
import {settingsPaneContent} from '../ui/Menu.css';
import {root, textField, firstFields} from '../ui/SaveEntityForm.css';
import {iconClose} from '../ui/Icons.css';

const ENTER_KEY = 13;

class StackDetail extends Component {

  static propTypes = {
    servers: PropTypes.object.isRequired,
    stack: PropTypes.object.isRequired,
    editStack: PropTypes.func.isRequired,
    saveStack: PropTypes.func.isRequired,
    meta: PropTypes.object
  }

  state = {
    title: this.props.stack.title,
    gitPath: this.props.stack.gitPath,
    diff: this.props.stack.diff,
    selectedServers: this.props.stack.servers ? this.props.stack.servers.join(',') : null
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.meta.stackIsSaving) {
      const {stack} = nextProps;
      if (stack) {
        const {title, gitPath, diff, servers} = stack;
        this.setState({title, gitPath, diff, selectedServers: servers ? servers.join(',') : null});
      }
      else this.setState({title: '', gitPath: '', diff: '', selectedServers: null});
    }
  }

  componentDidUpdate(prevProps) {
    const {stack} = this.props;
    if (prevProps.stack !== stack && stack) {
      findDOMNode(this.refs.title).focus();
    }
  }

  @autobind
  updateServers(selectedServers) {
    this.setState({selectedServers});
  }

  @autobind
  updateField(field, e) {
    this.setState({[field]: e.target.value});
  }

  @autobind
  saveStack(e) {
    if (e.nativeEvent instanceof KeyboardEvent && e.keyCode !== ENTER_KEY) return;
    e.preventDefault();

    const {stack, saveStack} = this.props;
    const title = findDOMNode(this.refs.title).value.trim();
    const gitPath = findDOMNode(this.refs.gitPath).value.trim();
    const diff = findDOMNode(this.refs.diff).value.trim();
    const selectedServers = this.state.selectedServers.split(',');
    if (title && gitPath && selectedServers) saveStack(stack, title, gitPath, selectedServers, diff);
  }

  render() {
    const {meta, stack, servers, editStack} = this.props;
    const {title, gitPath, selectedServers, diff} = this.state;
    const options = Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname}));

    return (
      <div className={styles.root}>
        <span title="Close settings" className={cx(iconClose, styles.iconClose)} onClick={editStack}>Close settings</span>
        <h2>{stack.title || 'New Stack'}</h2>
        <MenuScrollPane width={600}>
          <div className={settingsPaneContent}>
            <input ref="title" className={cx(textField, firstFields)} placeholder="Title" value={title} onKeyDown={this.saveStack}
                onChange={this.updateField.bind(this, 'title')} autoFocus/>
              <input ref="gitPath" className={cx(textField, firstFields)} placeholder="Git Path" value={gitPath} onKeyDown={this.saveStack}
                  onChange={this.updateField.bind(this, 'gitPath')}/>
              <Select name="servers" instanceId="whitelist" options={options} multi placeholder="Server Whitelist" simpleValue
                  className={styles.serversField} value={selectedServers} onChange={this.updateServers}/>
            <div className={root}>
              <input ref="diff" className={textField} placeholder="Diff URL" value={diff}
                  onKeyDown={this.saveStack} onChange={this.updateField.bind(this, 'diff')}/>
                <Button onClick={this.saveStack} isLoading={meta.stackIsSaving}>{stack.id ? 'Save' : 'Add'}</Button>
            </div>
          </div>

          {stack.id && <GroupsContainer/>}
        </MenuScrollPane>
      </div>
    );
  }

}

export default StackDetail;
