import React from 'react';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {render, cleanup, fireEvent} from 'react-testing-library';
import ServersContainer from './ServersContainer';
import reducer from './reducer';

const empty = {
  servers: {
    map: {}
  }
};

const single = {
  servers: {
    map: {
      1: {hostname: 'syd01.foobar.com', id: 1}
    }
  }
};

const multiple = {
  servers: {
    map: {
      1: {hostname: 'syd01.foobar.com', id: 1},
      2: {hostname: 'syd02.foobar.com', id: 2},
      3: {hostname: 'bri01.foobar.com', id: 3}
    }
  }
};

function click(element) {
  fireEvent(
    element,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  );
}

function renderWithRedux(view, initialState) {
  const store = createStore(combineReducers({servers: reducer}), initialState);
  return render(<Provider store={store}>{view}</Provider>);
}

afterEach(cleanup);

describe('servers', () => {
  it('renders a form for manipulating servers', () => {
    const {getByText, getByPlaceholderText} = renderWithRedux(<ServersContainer />, empty);
    const hostnameField = getByPlaceholderText('Hostname');
    expect(hostnameField).toBeDefined();
    expect(hostnameField.value).toEqual('');
    expect(getByText('Add')).toBeDefined();
  });

  it('renders an empty list if no servers present', () => {
    const {queryByTestId} = renderWithRedux(<ServersContainer />, empty);
    expect(queryByTestId('servers').children).toHaveLength(0);
  });

  it('renders servers', () => {
    const {queryByTestId, getByText} = renderWithRedux(<ServersContainer />, multiple);
    expect(queryByTestId('servers').children).toHaveLength(
      Object.keys(multiple.servers.map).length
    );
    for (const server of Object.values(multiple.servers.map)) {
      expect(getByText(server.hostname)).toBeDefined();
    }
  });

  it('renders server with edit and remove buttons', () => {
    const {getByText} = renderWithRedux(<ServersContainer />, single);
    expect(getByText('Edit server')).toBeDefined();
    expect(getByText('Remove server')).toBeDefined();
  });

  it('can edit a server', () => {
    const {getByText, getByPlaceholderText} = renderWithRedux(<ServersContainer />, single);
    click(getByText('Edit server'));
    expect(getByPlaceholderText('Hostname').value).toEqual(single.servers.map[1].hostname);
    expect(getByText('Save')).toBeDefined();
  });
});
