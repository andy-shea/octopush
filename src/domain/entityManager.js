import junction from 'junction-orm';
import mapper from '~/persistence/mapper';
import User from './user/User';
import Server from './server/Server';
import Stack from './stack/Stack';
import Deploy from './deploy/Deploy';

const entityManager = junction([User, Server, Stack, Deploy], mapper);

export default entityManager;
