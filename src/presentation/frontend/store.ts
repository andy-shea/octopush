import LogRocket from 'logrocket';
import {configureStoreCreator} from 'react-cornerstone';
import thunkMiddleware from 'redux-thunk'; // tslint:disable-line:no-implicit-dependencies
import deploysReducer from './deploys/reducer';
import routerReducer from './router/reducer';
import serversReducer from './servers/reducer';
import stacksReducer from './stacks/reducer';
import usersReducer from './users/reducer';

const reducers = {
  page: routerReducer,
  deploys: deploysReducer,
  servers: serversReducer,
  stacks: stacksReducer,
  users: usersReducer
};

function configureStore(forClient: boolean) {
  return forClient
    ? configureStoreCreator(reducers, () => [thunkMiddleware, LogRocket.reduxMiddleware()])
    : configureStoreCreator(reducers);
}

export default configureStore;
