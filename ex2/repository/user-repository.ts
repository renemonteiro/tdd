export interface IUser {
  id: string;
  name: string;
}

export interface IUserRepository {
  save(user: IUser): Promise<IUser>;
  edit(user: IUser): Promise<IUser>;
  getById(id: string): Promise<IUser | undefined>;
  delete(id: string): Promise<{ message: string }>;
  getList(): Promise<IUser[]>;
}

export class UserRepository implements IUserRepository {
  private list: IUser[] = [];

  constructor() {}

  save(user: IUser): Promise<IUser> {
    this.list.push(user);
    return new Promise((resolve) => resolve(user));
  }

  edit(user: IUser): Promise<IUser> {
    let index = this.list.findIndex((item) => item.id === user.id);
    this.list.splice(index, 1);
    this.save(user);
    return new Promise((resolve) => resolve(user));
  }
  getById(id: string): Promise<IUser | undefined> {
    const user = this.list.find((item) => item.id === id);
    return new Promise((resolve) => resolve(user));
  }
  delete(id: string): Promise<{ message: string }> {
    const index = this.list.findIndex((item) => item.id === id);
    this.list.splice(index, 1);
    return new Promise((resolved) =>
      resolved({
        message: "entity removed",
      })
    );
  }
  getList(): Promise<IUser[]> {
    return new Promise((resolved) => resolved(this.list));
  }
}
