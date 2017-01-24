import React, {Component, PropTypes} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import PageLoader from '../ui/PageLoader';
import {root} from './Terminal.css';
import {terminalWrap, loader} from './DeployRow.css';

class Terminal extends Component {

  static propTypes = {log: PropTypes.string}

  componentDidUpdate(prevProps) {
    if (this.refs.terminal && (prevProps.log || '').length !== this.props.log.length) {
      this.refs.terminal.scrollToBottom();
    }
  }

  render() {
    const {log} = this.props;
    if (typeof log === 'undefined') return <PageLoader className={loader}/>;
    return (
      <Scrollbars ref="terminal" className={terminalWrap} autoHeight autoHeightMin={50} autoHeightMax={400} style={{width: 'auto'}}>
        <pre className={root} dangerouslySetInnerHTML={{__html: log}}/>
      </Scrollbars>
    );
  }

}

export default Terminal;
