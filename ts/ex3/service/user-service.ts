import { IBaseRepository } from "../repository/interface/IBaseReposiroty";
import { IUser } from "../repository/user-repository";
import { IBaseService } from "./interface/IBaseService";

export class UserService extends IBaseService<IUser> {
  constructor(protected repository: IBaseRepository<IUser>) {
    super(repository);
  }
}
