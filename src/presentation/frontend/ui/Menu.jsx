import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import autobind from 'autobind-decorator';
import cx from 'classnames';
import ServersContainer from '../servers/ServersContainer';
import StacksContainer from '../stacks/StacksContainer';
import iconStyles from '../ui/Icons.css';
import styles from './Menu.css';

let didScroll;
let scrollPosition;

function scrollPage() {
  scrollPosition = {x: window.pageXOffset || window.document.documentElement.scrollLeft, y: window.pageYOffset || window.document.documentElement.scrollTop};
  didScroll = false;
}

function scrollHandler() {
  if (!didScroll) {
    didScroll = true;
    setTimeout(scrollPage, 60);
  }
}

function noScrollFn() {
  window.scrollTo(scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0);
}

function noScroll() {
  window.removeEventListener('scroll', scrollHandler);
  window.addEventListener('scroll', noScrollFn);
}

function scrollFn() {
  window.addEventListener('scroll', scrollHandler);
}

function canScroll() {
  window.removeEventListener('scroll', noScrollFn);
  scrollFn();
}

if (typeof window !== 'undefined') scrollFn();

/**
 * uiMorphingButton_fixed.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
class Menu extends Component {

  state = {isExpanded: false, settingsPane: null}

  @autobind
  openServersPane(e) {
    e.preventDefault();
    this.setState(previousState => {
      previousState.settingsPane = <ServersContainer/>;
      return previousState;
    });
  }

  @autobind
  openStacksPane(e) {
    e.preventDefault();
    this.setState(previousState => {
      previousState.settingsPane = <StacksContainer/>;
      return previousState;
    });
  }

  @autobind
  onSettingsTransitionEnd(e) {
    const settingsElement = findDOMNode(this.refs.settings);
    const contentElement = findDOMNode(this.refs.settingsContent);
    if (e.target === contentElement) {
      // open: first opacity then width/height/left/top
      // close: first width/height/left/top then opacity
      if (!this.state.isExpanded && e.propertyName !== 'opacity' || this.state.isExpanded && e.propertyName !== 'width' &&
          e.propertyName !== 'height' && e.propertyName !== 'left' && e.propertyName !== 'top') {
        e.stopPropagation();
      }
      else contentElement.removeEventListener('transitionend', this.onSettingsTransitionEnd);

      this.isAnimating = false;

      if (this.state.isExpanded) {
        canScroll();
        settingsElement.classList.add(styles.scroll);
      }
      else {
        settingsElement.classList.remove(styles.active);
        canScroll();
      }
    }
  }

  @autobind
  toggleMenu(e) {
    if (this.isAnimating) e.stopPropagation();
    noScroll();

    this.setState({isExpanded: !this.state.isExpanded, settingsPane: null}, () => {
      document.getElementById('container').classList.toggle(styles.pushed);
      const settingsElement = findDOMNode(this.refs.settings);
      if (this.state.isExpanded) settingsElement.classList.add(styles.active);
      else settingsElement.classList.remove(styles.scroll);
      this.isAnimating = true;
      findDOMNode(this.refs.settingsContent).addEventListener('transitionend', this.onSettingsTransitionEnd);
    });
  }

  render() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const {settingsButton, settings, settingsContent} = this.refs;
        const {left, top} = findDOMNode(settingsButton).getBoundingClientRect();
        const settingsElement = findDOMNode(settings);
        const contentElement = findDOMNode(settingsContent);
        contentElement.style.left = left + 'px';
        contentElement.style.top = top + 'px';
        contentElement.classList.remove(styles.noTransition);

        if (this.state.isExpanded) {
          setTimeout(() => {
            contentElement.classList.remove(styles.noTransition);
            settingsElement.classList.add(styles.open);
          }, 25);
        }
        else {
          contentElement.classList.remove(styles.noTransition);
          settingsElement.classList.remove(styles.open);
        }
      }, 25);
    }

    const {settingsPane} = this.state;
    const contentClasses = cx(styles.morphContent, styles.noTransition, {[styles.settingsOpen]: settingsPane});

    return (
      <div ref="settings" className={cx(styles.morphButton, styles.morphButtonSidebar, styles.morphButtonFixed)}>
        <button ref="settingsButton" type="button" onClick={this.toggleMenu}>
          <svg className={iconStyles.svgIcon} dangerouslySetInnerHTML={{__html: '<use xlink:href="#settings"/>'}}/>
          <span>Settings Menu</span>
        </button>
        <div ref="settingsContent" className={contentClasses} style={{left: 'auto', top: 'auto'}}>
          <div>
            <div className={styles.contentStyleSidebar}>
              <span title="Close settings" className={cx(iconStyles.iconClose, styles.iconClose)} onClick={this.toggleMenu}>Close settings</span>
              <h2>Octopush</h2>
              <ul>
                <li>
                  <svg className={cx(iconStyles.svgIcon, styles.iconStacks)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#stacks"/>'}}/>
                  <a href="#" onClick={this.openStacksPane}>Stacks</a>
                </li>
                <li>
                  <span className={cx(iconStyles.iconServer, styles.iconServer)}/>
                  <a href="#" onClick={this.openServersPane}>Servers</a>
                </li>
                <li>
                  <svg className={cx(iconStyles.svgIcon, styles.iconLogout)} dangerouslySetInnerHTML={{__html: '<use xlink:href="#logout"/>'}}/>
                  <a href="/logout" onClick={this.toggleMenu}>Log out</a>
                </li>
              </ul>
            </div>
            <div className={styles.settingsPane}>
              {settingsPane}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Menu;
