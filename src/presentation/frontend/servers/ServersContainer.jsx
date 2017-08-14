import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import {connect} from 'react-redux';
import {actions} from './actions';
import Servers from './Servers';
import {getServers, getServerEditing} from './selectors';

const handlers = withHandlers({
  saveServer: props => (hostname) => {
    const {serverEditing, editServer, updateServer, addServer} = props;
    if (serverEditing) {
      if (hostname !== serverEditing.hostname) updateServer({server: serverEditing, newHostname: hostname});
      else editServer(null);
    }
    else addServer({hostname});
  }
});

function mapStateToProps(state) {
  return {
    servers: getServers(state),
    serverEditing: getServerEditing(state)
  };
}

const ServersContainer = compose(connect(mapStateToProps, actions), handlers)(Servers);

export default ServersContainer;
