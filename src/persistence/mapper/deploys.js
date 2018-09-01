import s from 'string';
import db from '~/persistence';
import Deploy from '~/domain/deploy/Deploy';

const {
  schema: {timestampable, props: schemaProps}
} = Deploy;

const mapper = {
  async insert(trx, deploys) {
    const allValues = deploys.map(({branch, logFile, hosts, user, stack}) => {
      const values = {
        branch,
        log_file: logFile,
        hosts: JSON.stringify(hosts),
        user_id: user.id,
        stack_id: stack.id
      };
      if (timestampable) {
        values.created_at = db.fn.now();
        values.updated_at = db.fn.now();
      }
      return values;
    });
    const ids = await db('deploys')
      .transacting(trx)
      .insert(allValues, 'id');
    ids.map((id, index) => {
      deploys[index].id = id;
    });
  },

  updateDeploy(trx, deploy, props) {
    const values = props.reduce((map, prop) => {
      map[schemaProps[prop].column || s(prop).underscore().s] =
        schemaProps[prop].type === 'json' ? JSON.stringify(deploy[prop]) : deploy[prop];
      return map;
    }, {});
    if (timestampable) values.updated_at = db.fn.now();
    return db('deploys')
      .transacting(trx)
      .where({id: deploy.id})
      .update(values);
  },

  update(trx, observers) {
    return Promise.all(
      observers.reduce((mods, observer) => {
        mods.push(this.updateDeploy(trx, observer.entity, observer.changed().props));
        return mods;
      }, [])
    );
  },

  delete(trx, deploys) {
    return db('deploys')
      .transacting(trx)
      .whereIn('id', deploys.map(deploy => deploy.id))
      .del();
  }
};

export default mapper;
