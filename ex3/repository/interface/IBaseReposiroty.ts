interface hasId {
  id: string;
}

export abstract class IBaseRepository<T extends hasId> {
  protected list: T[] = [];

  async save(entity: T): Promise<T> {
    this.list.push(entity);
    return new Promise((resolve) => resolve(entity));
  }
  async edit(id: string, entity: T): Promise<T> {
    let index = this.list.findIndex((item) => item.id === id);
    this.list.splice(index, 1);
    this.save(entity);
    return new Promise((resolve) => resolve(entity));
  }

  async getById(id: string): Promise<T | { message: string }> {
    const entity = this.list.find((item) => item.id === id);
    if (!entity) {
      return new Promise((resolved) => resolved({ message: "user not found" }));
    }
    return new Promise((resolve) => resolve(entity));
  }
  async delete(id: string): Promise<{ message: string }> {
    const index = this.list.findIndex((item) => item.id === id);
    if (!index) {
      return new Promise((resolved) =>
        resolved({
          message: "entity not found",
        })
      );
    }
    this.list.splice(index, 1);
    return new Promise((resolved) =>
      resolved({
        message: "entity removed",
      })
    );
  }
  async getList(): Promise<T[]> {
    return new Promise((resolved) => resolved(this.list));
  }
}
