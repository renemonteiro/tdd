import { IBaseRepository } from "./interface/IBaseReposiroty";

export interface IUser {
  id: string;
  name: string;
}

export class UserRepository extends IBaseRepository<IUser> {
  protected list: IUser[] = [];

  constructor() {
    super();
  }
}
