import React, {Component} from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {actions} from './actions';
import Servers from './Servers';
import {getServers} from './selectors';

@connect(
  state => ({servers: getServers(state)}),
  actions
)
class ServersContainer extends Component {

  state = {};

  @autobind
  editServer(server) {
    this.setState({serverEditing: server});
  }

  @autobind
  saveServer({hostname}, {resetForm, setErrors}) {
    const {updateServer, addServer} = this.props;
    const {serverEditing} = this.state;
    if (serverEditing) {
      if (hostname !== serverEditing.hostname) {
        updateServer(
          {serverId: serverEditing.id, newHostname: hostname},
          {onSuccess: this.editServer, setErrors}
        );
      }
      else this.editServer();
    }
    else addServer({hostname}, {onSuccess: resetForm, setErrors});
  }

  render() {
    const {removeServer, servers} = this.props;
    return (
      <Servers
        serverEditing={this.state.serverEditing}
        saveServer={this.saveServer}
        editServer={this.editServer}
        removeServer={removeServer}
        servers={servers}
      />
    );
  }

}

export default ServersContainer;
