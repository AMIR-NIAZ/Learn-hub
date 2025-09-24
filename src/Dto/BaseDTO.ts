// dtos/BaseDTO.ts
export interface BaseEntity {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseDTO<T> {
  public id: any;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(entity: T & BaseEntity) {
    this.id = entity._id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  abstract toObject(): object;
  abstract toJSON(): string;
}