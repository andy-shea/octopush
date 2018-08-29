import {configureStoreCreator} from 'react-cornerstone';
import routerReducer from './router/reducer';
import deploysReducer from './deploys/reducer';
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

const configureStore = configureStoreCreator(reducers);

export default configureStore;
