import junction from 'junction-orm';
import mapper from '~/persistence/mapper';
import Deploy from './deploy/Deploy';
import Server from './server/Server';
import Stack from './stack/Stack';
import User from './user/User';

const entityManager = junction([User, Server, Stack, Deploy], mapper);

export default entityManager;
