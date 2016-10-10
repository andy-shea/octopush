import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import Select from 'react-select';
import autobind from 'autobind-decorator';
import Button from '../ui/Button';
import {root, textField} from '../ui/SaveEntityForm.css';

const ENTER_KEY = 13;

class SaveGroupForm extends Component {

  static propTypes = {
    saveGroup: PropTypes.func.isRequired,
    group: PropTypes.object.isRequired,
    servers: PropTypes.object,
    meta: PropTypes.object
  }

  state = {
    name: this.props.group.name,
    selectedServers: this.props.group.servers ? this.props.group.servers.join(',') : null
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.meta.groupIsSaving) {
      const {group} = nextProps;
      if (group) {
        const {name, servers: serverIds} = group;
        this.setState({name, selectedServers: serverIds ? serverIds.join(',') : null});
      }
      else this.setState({name: '', selectedServers: null});
    }
  }

  @autobind
  updateName(e) {
    this.setState({name: e.target.value});
  }

  @autobind
  updateServers(selectedServers) {
    this.setState({selectedServers});
  }

  @autobind
  saveGroup(e) {
    if (e.nativeEvent instanceof KeyboardEvent && e.keyCode !== ENTER_KEY) return;
    e.preventDefault();

    const name = findDOMNode(this.refs.name).value.trim();
    const selectedServers = this.state.selectedServers.split(',');
    const {group, saveGroup} = this.props;
    if (name && selectedServers) saveGroup(group, name, selectedServers);
  }

  render() {
    const {meta, servers, group} = this.props;
    const {selectedServers, name} = this.state;
    const options = servers ? Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname})) : [];

    return (
      <div>
        <Select name="servers" instanceId="servers" options={options} multi placeholder="Servers" simpleValue value={selectedServers} onChange={this.updateServers}/>
        <div className={root}>
          <input ref="name" className={textField} placeholder="Name" value={name} onChange={this.updateName} onKeyDown={this.saveGroup}/>
          <Button onClick={this.saveGroup} isLoading={meta.groupIsSaving}>{group.id ? 'Save' : 'Add'}</Button>
        </div>
      </div>
    );
  }

}

export default SaveGroupForm;
