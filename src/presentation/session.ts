import config from 'config';
import connectSessionKnex from 'connect-session-knex';
import expressSession from 'express-session';
import db from '~/persistence';

const KnexSessionStore = connectSessionKnex(expressSession);
const session = expressSession({
  secret: config.get('session.secret'),
  saveUninitialized: false,
  resave: false,
  store: new KnexSessionStore({knex: db})
});

export default session;
