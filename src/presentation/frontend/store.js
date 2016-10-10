import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';
import thunkMiddleware from 'redux-thunk';
import deploysReducer from './deploys/reducer';
import serversReducer from './servers/reducer';
import stacksReducer from './stacks/reducer';
import usersReducer from './users/reducer';

function configureStore(forClient, history, initialState = {}) {
  const devToolsEnhancer = forClient && window.devToolsExtension ? window.devToolsExtension() : f => f;

  const reducer = combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,
    deploys: deploysReducer,
    servers: serversReducer,
    stacks: stacksReducer,
    users: usersReducer
  });

  const store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        routerMiddleware(history)
      ),
      devToolsEnhancer
    )
  );

  return store;
}

export default configureStore;
