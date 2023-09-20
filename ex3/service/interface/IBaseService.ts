import { IBaseRepository } from "../../repository/interface/IBaseReposiroty";

interface hasId {
  id: string;
}
export interface IService<T> {
  save(entity: T): Promise<T>;
  edit(entity: T): Promise<T>;
  getById(id: string): Promise<T | string>;
  delete(id: string): Promise<{ message: string }>;
}
export abstract class IBaseService<T extends hasId> implements IService<T> {
  constructor(private baseRepository: IBaseRepository<T>) {}
  async save(entity: T): Promise<T> {
    return await this.baseRepository.save(entity);
  }

  async edit(entity: T): Promise<T> {
    return await this.baseRepository.edit(entity);
  }

  async getById(id: string): Promise<T | string> {
    const entity = await this.baseRepository.getById(id);
    if (!entity) {
      return "entity not found";
    }
    return entity;
  }

  async delete(id: string): Promise<{ message: string }> {
    return await this.baseRepository.delete(id);
  }
}
