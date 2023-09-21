import { IBaseRepository } from "../../repository/interface/IBaseReposiroty";

interface hasId {
  id: string;
}
export interface IService<T> {
  save(entity: T): Promise<T>;
  edit(id: string, entity: T): Promise<T>;
  getById(id: string): Promise<T | { message: string }>;
  delete(id: string): Promise<{ message: string }>;
}
export abstract class IBaseService<T extends hasId> implements IService<T> {
  constructor(private baseRepository: IBaseRepository<T>) {}
  async save(entity: T): Promise<T> {
    return await this.baseRepository.save(entity);
  }

  async edit(id: string, entity: T): Promise<T> {
    return await this.baseRepository.edit(id, entity);
  }

  async getById(id: string): Promise<T | { message: string }> {
    const entity = await this.baseRepository.getById(id);

    return entity;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.baseRepository.delete(id);
    if (!result) {
      return {
        message: "try again",
      };
    }
    return {
      message: "entity removed",
    };
  }
}
