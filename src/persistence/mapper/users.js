import db from '~/persistence';

const mapper = {
  async insert(trx, users) {
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
    ids.map((id, index) => {
      users[index].id = id;
    });
  },

  update() {},

  delete() {}
};

export default mapper;
