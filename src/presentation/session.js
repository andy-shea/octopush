import config from 'config';
import expressSession from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import db from '~/persistence';

const KnexSessionStore = connectSessionKnex(expressSession);
const session = expressSession({
  key: 'octopush',
  secret: config.session.secret,
  saveUninitialized: false,
  resave: false,
  store: new KnexSessionStore({knex: db})
});

export default session;
