import { BaseItem } from './../../types/BaseModel';

export class BaseService<T extends BaseItem> {
  private _mockListData: T[];

  constructor(mockData: T[]) {
    this._mockListData = mockData;
  }

  public async findAll() {
    return this._mockListData;
  }

  public findById(id: BaseItem['id']) {
    return this._mockListData.find(item => item.id === id);
  }
}
