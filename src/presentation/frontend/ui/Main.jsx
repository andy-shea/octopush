import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import styled from 'styled-components';
import Menu from './menu/Menu';

const handlers = {
  openPane: ({updateMenu}) => settingsPane => {
    updateMenu(state => ({...state, settingsPane}));
  },

  toggleMenu: ({updateMenu}) => () => {
    updateMenu(state => ({...state, expanded: !state.expanded, settingsPane: undefined}));
  }
};

const enhance = compose(
  withState('menu', 'updateMenu', {expanded: false, settingsPane: null}),
  withHandlers(handlers)
);

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1% 2% 100px;
  background: var(--color-grey);
  position: absolute;
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  ${({expanded}) => expanded && `
    transition-duration: 0.5s;
    transform: translateX(300px);
  `}
`;

function Main({children, toggleMenu, menu: {expanded, settingsPane}, openPane}) {
  return (
    <>
      <Container expanded={expanded}>{children}</Container>
      <Menu toggleMenu={toggleMenu} expanded={expanded} settingsPane={settingsPane} openPane={openPane}/>
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  openPane: PropTypes.func.isRequired,
  menu: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    settingsPane: PropTypes.element
  })
};

export default enhance(Main);
