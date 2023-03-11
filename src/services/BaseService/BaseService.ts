import { BaseItem } from '../../typings/BaseModel';

export class BaseService<T extends BaseItem> {
  private _mockListData: T[];

  constructor(mockData: T[]) {
    this._mockListData = mockData;
  }

  public async findAll() {
    return this._mockListData;
  }

  public async findById(id: BaseItem['id']): Promise<T | undefined> {
    return this._mockListData.find(item => item.id === id);
  }
}
