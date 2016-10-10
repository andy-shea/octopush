import db from '~/persistence';

const mapper = {
  insert(trx, users) {
    const values = users.map(({name, email, password}) => ({name, email, password, created_at: db.fn.now(), updated_at: db.fn.now()}));
    return db('users').transacting(trx).insert(values, 'id').then(ids => {
      ids.map((id, index) => {
        users[index].id = id;
      });
    });
  },

  update() {
  },

  delete() {
  }
};

export default mapper;
