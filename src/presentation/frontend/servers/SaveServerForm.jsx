import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import autobind from 'autobind-decorator';
import Button from '../ui/Button';
import {root, textField} from '../ui/SaveEntityForm.css';

const ENTER_KEY = 13;

class SaveServerForm extends Component {

  static propTypes = {
    saveServer: PropTypes.func.isRequired,
    meta: PropTypes.object,
    server: PropTypes.object
  }

  state = {hostname: ''}

  componentWillReceiveProps(nextProps) {
    if (!nextProps.meta.isSaving) {
      this.setState({hostname: nextProps.server ? nextProps.server.hostname : ''});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.server !== this.props.server && this.props.server) {
      findDOMNode(this.refs.hostname).focus();
    }
  }

  @autobind
  updateValue(e) {
    this.setState({hostname: e.target.value});
  }

  @autobind
  saveServer(e) {
    if (e.nativeEvent instanceof KeyboardEvent && e.keyCode !== ENTER_KEY) return;
    e.preventDefault();
    const hostname = findDOMNode(this.refs.hostname).value.trim();
    if (hostname) this.props.saveServer(hostname);
  }

  render() {
    const {meta, server} = this.props;
    return (
      <div className={root}>
        <input ref="hostname" className={textField} placeholder="Hostname" value={this.state.hostname}
            onChange={this.updateValue} onKeyDown={this.saveServer} autoFocus/>
          <Button onClick={this.saveServer} isLoading={meta.isSaving}>{server ? 'Save' : 'Add'}</Button>
      </div>
    );
  }

}

export default SaveServerForm;
