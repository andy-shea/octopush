import {Entity} from 'junction-orm/lib/Entity';
import EntityObserver from 'junction-orm/lib/observer/EntityObserver';
import {Transaction} from 'knex';

interface EntityMapper {
  insert(trx: Transaction, entities: Entity[]): any;
  update(trx: Transaction, observers: EntityObserver[]): any;
  delete(trx: Transaction, entities: Entity[]): any;
}

export default EntityMapper;
