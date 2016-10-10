import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import autobind from 'autobind-decorator';
import cx from 'classnames';
import Header from '../ui/Header';
import {centre, content} from '../ui/Header.css';
import {header, button} from './Login.css';
import {form, button as baseButton, cta} from '../ui/Form.css';
import {root} from '../ui/error.css';

class Login extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    error: PropTypes.object
  }

  @autobind
  login(event) {
    event.preventDefault();
    const username = findDOMNode(this.refs.username).value;
    const password = findDOMNode(this.refs.password).value;
    if (username && password) this.props.login(username, password);
  }

  render() {
    const {error} = this.props;
    return (
      <Header className={cx(header, centre)}>
        <form className={cx(form, content)}>
          <p>
            <label htmlFor="username">Email</label>
            <input type="email" ref="username" autoFocus/>
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input type="password" ref="password"/>
          </p>
          {error && <p className={root}>{error.message}</p>}
          <p>
            <button type="submit" className={cx(baseButton, cta, button)} onClick={this.login}>Log in</button>
          </p>
        </form>
      </Header>
    );
  }

}

export default Login;
