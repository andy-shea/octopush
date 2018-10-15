import User from '~/domain/user/User';
import db from '~/persistence';
import EntityMapper from './mapper';

const mapper: EntityMapper = {
  async insert(trx, users: User[]) {
    const values = users.map(({name, email, password}) => ({
      name,
      email,
      password,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }));
    const ids = await db('users')
      .transacting(trx)
      .insert(values, 'id');
    ids.map((id: number, index: number) => {
      users[index].id = id;
    });
  },

  update() {}, // tslint:disable-line:no-empty

  delete() {} // tslint:disable-line:no-empty
};

export default mapper;
