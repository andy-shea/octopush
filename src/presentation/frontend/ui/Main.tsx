import React, {ReactElement, ReactNode, SFC} from 'react';
import {compose, StateHandler, withHandlers, withState} from 'recompose';
import styled, {css} from 'styled-components';
import Menu from './menu/Menu';

interface MenuState {
  expanded: boolean;
  settingsPane?: ReactElement<any>;
}

interface HandlerProps {
  updateMenu: StateHandler<MenuState>;
}

interface MainProps {
  children: ReactNode;
  menu: MenuState;
  toggleMenu(): void;
  openPane(settingsPane: ReactElement<any>): void;
}

const handlers = {
  openPane: ({updateMenu}: HandlerProps) => (settingsPane: ReactNode) => {
    updateMenu((state: MenuState) => ({...state, settingsPane}));
  },

  toggleMenu: ({updateMenu}: HandlerProps) => () => {
    updateMenu((state: MenuState) => ({...state, expanded: !state.expanded, settingsPane: undefined}));
  }
};

const enhance = compose<MainProps, {}>(
  withState('menu', 'updateMenu', {expanded: false, settingsPane: undefined}),
  withHandlers(handlers)
);

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1% 2% 100px;
  background: var(--color-grey);
  position: absolute;
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  ${({expanded}: {expanded: boolean}) => expanded && css`
    transition-duration: 0.5s;
    transform: translateX(300px);
  `};
`;

const Main: SFC<MainProps> = ({children, toggleMenu, menu: {expanded, settingsPane}, openPane}) => {
  return (
    <>
      <Container expanded={expanded}>{children}</Container>
      <Menu
        toggleMenu={toggleMenu}
        expanded={expanded}
        settingsPane={settingsPane}
        openPane={openPane}
      />
    </>
  );
};

export default enhance(Main);
