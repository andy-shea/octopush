import {Transaction} from 'knex';
import s from 'string';
import Deploy from '~/domain/deploy/Deploy';
import Stack from '~/domain/stack/Stack';
import db from '~/persistence';
import EntityMapper from './mapper';

const {schema: {timestampable, props: schemaProps}} = Deploy;

interface DeployMapper extends EntityMapper {
  updateDeploy(trx: Transaction, deploy: Deploy, props: string[]): any;
}

const mapper: DeployMapper = {
  async insert(trx, deploys: Deploy[]) {
    const allValues = deploys.map(({branch, logFile, hosts, user, stack}) => {
      const values: any = {
        branch,
        log_file: logFile,
        hosts: JSON.stringify(hosts),
        user_id: user.id,
        stack_id: (stack as Stack).id
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
    ids.map((id: number, index: number) => {
      deploys[index].id = id;
    });
  },

  updateDeploy(trx: Transaction, deploy: Deploy, props: string[]): any {
    const values = props.reduce((map: any, prop) => {
      map[schemaProps[prop].column || s(prop).underscore().s] = schemaProps[prop].type === 'json'
        ? JSON.stringify((deploy as any)[prop])
        : (deploy as any)[prop];
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
      observers.reduce((mods: Array<Promise<any>>, observer) => {
        mods.push(this.updateDeploy(trx, observer.entity as Deploy, observer.changed().props));
        return mods;
      }, [])
    );
  },

  delete(trx, deploys) {
    return db('deploys')
      .transacting(trx)
      .whereIn('id', deploys.map(deploy => deploy.id) as number[])
      .del();
  }
};

export default mapper;
