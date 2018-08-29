import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import {clearFix} from 'polished';
import withHandlers from 'recompose/withHandlers';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import Terminal from './Terminal';
import Hosts from './Hosts';

const handlers = withHandlers({
  toggleDeployDetails: props => e => {
    const {deploy, toggleDeployDetails} = props;
    if (e.target.dataset.toggleDeploy || !deploy.isExpanded) {
      toggleDeployDetails(deploy, e);
    }
  }
});

const StyledDeployRow = styled.article`
  position: relative;
  padding: 1em 0;
  border-bottom: 1px solid var(--color-grey-10);
  transition: background 0.2s;

  // prettier-ignore
  ${({expanded}) =>
    !expanded &&
    css`
      &:hover {
        cursor: pointer;
        background: var(--color-white);
      }
    `};
`;

const Header = styled.header`
  ${clearFix()};
  margin-left: 20%;

  & h1 {
    font-size: 1.2em;
    margin: 0;
  }
`;

const Footer = styled.footer`
  position: absolute;
  top: 1.2em;
  width: 20%;
  color: var(--color-grey-30);
  font-size: 0.85em;
  text-transform: uppercase;
  padding-left: 2em;
  margin-top: 0.3em;
  line-height: 1.4em;

  & > p {
    margin: 0;
  }
`;

const meta = css`
  font-size: 1.1em;
  text-transform: none;
  color: var(--color-blue-10);
  margin-left: 0.2em;
`;
const Time = styled.b`
  ${meta};
`;
const User = styled.i`
  ${meta};
`;

const transitionDuration = '0.5s';
const ToggleDeployButton = styled.span`
  position: absolute;
  top: 1.3em;
  right: 2em;
  padding: 1em 0;
  display: inline-block;
  transition: ${transitionDuration} / 2;
  cursor: pointer;
  user-select: none;

  ${({expanded}) =>
    expanded &&
    css`
      transform: scale(0.8);
    `};
`;

const ToggleDeployIcon = styled.i`
  position: relative;
  display: block;
  width: 3em;
  height: 1px;
  background: var(--color-blue);
  transition: ${transitionDuration};

  &::after,
  &::before {
    display: block;
    content: '';
    height: 1px;
    width: 3em;
    background: var(--color-blue);
    position: absolute;
    transition: ${transitionDuration} (${transitionDuration} / 2);
  }

  &::after {
    top: -0.625em;
  }
  &::before {
    top: 0.625em;
  }

  ${({expanded}) =>
    expanded &&
    css`
      background: transparent;

      &::after,
      &::before {
        top: 0 !important;
        transition: ${transitionDuration};
      }
      &::after {
        transform: rotate(45deg);
      }
      &::before {
        transform: rotate(-45deg);
      }
    `};
`;

export function DeployRow({diff, deploy, user: {name}, toggleDeployDetails}) {
  return (
    <StyledDeployRow expanded={deploy.isExpanded} onClick={toggleDeployDetails}>
      <Header>
        <h1>{deploy.branch}</h1>
        <Hosts hosts={deploy.hosts} diff={diff} />
      </Header>
      <Terminal log={deploy.log} expanded={deploy.isExpanded} />
      <Footer>
        <p>
          Deployed{' '}
          <Time title={format(deploy.createdAt)}>
            {distanceInWordsToNow(deploy.createdAt, {includeSeconds: true})} ago
          </Time>
        </p>
        <p>
          by <User>{name}</User>
        </p>
      </Footer>
      <ToggleDeployButton expanded={deploy.isExpanded} data-toggle-deploy>
        <ToggleDeployIcon expanded={deploy.isExpanded} data-toggle-deploy />
      </ToggleDeployButton>
    </StyledDeployRow>
  );
}

DeployRow.propTypes = {
  deploy: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  toggleDeployDetails: PropTypes.func.isRequired,
  diff: PropTypes.string
};

export default handlers(DeployRow);
