import { Model, QueryBuilder } from 'objection';
import { v4 as uuidv4 } from 'uuid';

export class BaseModel extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string | null;

  $beforeInsert() {
    if (!this.id) {
      this.id = uuidv4();
    }
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get idColumn() {
    return 'id';
  }

  static get QueryBuilder() {
    return class SoftDeleteQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
      whereNotDeleted() {
        return this.whereNull(`${this.modelClass().tableName}.deleted_at`);
      }
    };
  }
}
