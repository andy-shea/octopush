import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import {Scrollbars} from 'react-custom-scrollbars';
import PageLoader from '../ui/PageLoader';

const TerminalWrap = styled.div`
  margin-right: 3em;
  max-width: 100%;
  display: none;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 20%;

  ${({expanded}) => expanded && css`
    margin-top: 1em;
    margin-bottom: 1em;
    display: block;
  `}
`;

const StyleTerminal = styled.pre`
  font-family: Inconsolata, "Courier New", Courier, monospace;
  font-size: 0.9em;
  line-height: 1;
  white-space: nowrap;
`;

const TerminalLoader = styled(PageLoader)`
  margin-left: 20%;
  display: ${({expanded}) => expanded ? 'block' : 'none'};
`;

class Terminal extends Component {

  static propTypes = {
    log: PropTypes.string,
    expanded: PropTypes.bool
  }

  componentDidUpdate(prevProps) {
    if (this.refs.terminal && (prevProps.log || '').length !== this.props.log.length) {
      this.refs.terminal.scrollToBottom();
    }
  }

  render() {
    const {log, expanded} = this.props;
    if (typeof log === 'undefined') return <TerminalLoader expanded={expanded}/>;
    return (
      <TerminalWrap expanded={expanded}>
        <Scrollbars ref="terminal" autoHeight autoHeightMin={50} autoHeightMax={400} style={{width: 'auto'}}>
          <StyleTerminal dangerouslySetInnerHTML={{__html: log}}/>
        </Scrollbars>
      </TerminalWrap>
    );
  }

}

export default Terminal;
