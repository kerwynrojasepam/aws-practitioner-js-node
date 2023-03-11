import { v4 as uuidv4 } from 'uuid';
import { dynamoDBClient as _dynamoDBClient } from '@services/DynamoDBClient';
import { DBError } from '@errors/DBError';
import { BaseItem, UUID } from '@typings/BaseModel';

const DEFAULT_FIELD_ID = 'id';
const UNKNOWN_ERROR = 'Unknown error';

export interface BaseService<T> {
  postCreate?(newProduct: T): Promise<T>;
}

export abstract class BaseService<T extends BaseItem> {
  private _tableName: string;
  private _fieldId = DEFAULT_FIELD_ID;
  private _dynamoDBClient: typeof _dynamoDBClient;

  constructor(tableName: string, fieldId?: string) {
    this._dynamoDBClient = _dynamoDBClient;
    this._tableName = tableName;
    this._fieldId = fieldId || DEFAULT_FIELD_ID;
  }

  protected getTableName() {
    return this._tableName;
  }

  protected getFieldId() {
    return this._fieldId;
  }

  protected getDynamoDBClient() {
    return this._dynamoDBClient;
  }

  public async findAll(): Promise<T[]> {
    try {
      const data = await this._dynamoDBClient
        .scan({
          TableName: this._tableName,
        })
        .promise();

      console.log('data.Items', data.Items);

      return data.Items as T[];
    } catch (error) {
      console.error(`[BaseService|${this._tableName}|findAll]`, error);
      throw new DBError(error.message || UNKNOWN_ERROR);
    }
  }

  public async findById(id: UUID): Promise<T> {
    console.log('findById', this._fieldId, id);
    try {
      const response = await this._dynamoDBClient
        .query({
          TableName: this._tableName,
          KeyConditionExpression: `${this._fieldId} = :id`,
          ExpressionAttributeValues: {
            ':id': id,
          },
        })
        .promise();

      return response.Items[0] as T;
    } catch (error) {
      console.error(`[BaseService|${this._tableName}|findById]`, error);
      throw new DBError(error.message || UNKNOWN_ERROR);
    }
  }

  public async create(data: any, paramId?: UUID) {
    const id = paramId || uuidv4();

    try {
      const item: T = {
        [this._fieldId]: id,
        ...data,
      };

      await this._dynamoDBClient
        .put({
          TableName: this._tableName,
          Item: item,
        })
        .promise();

      return this.postCreate ? this.postCreate(item) : item;
    } catch (error) {
      console.error(`[BaseService|${this._tableName}|create]`, error);
      throw new DBError(error.message || UNKNOWN_ERROR);
    }
  }

  public async hasData() {
    try {
      const result = await this._dynamoDBClient
        .scan({
          TableName: this._tableName,
          Limit: 1,
        })
        .promise();

      return result.Count > 0;
    } catch (error) {
      console.error(`[BaseService|${this._tableName}|hasData]`, error);
      throw new DBError(error.message || UNKNOWN_ERROR);
    }
  }
}
