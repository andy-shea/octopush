import {configureStoreCreator} from 'react-cornerstone/common';
import deploysReducer from './deploys/reducer';
import serversReducer from './servers/reducer';
import stacksReducer from './stacks/reducer';
import usersReducer from './users/reducer';

const configureStore = configureStoreCreator({
  deploys: deploysReducer,
  servers: serversReducer,
  stacks: stacksReducer,
  users: usersReducer
});

export default configureStore;
