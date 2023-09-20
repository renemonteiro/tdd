import { IUser } from "../repository/user-repository";
import { IBaseService } from "../service/interface/IBaseService";
import { IBaseController } from "./interfaces/IBaseController";

export class UserController extends IBaseController<IUser> {
  constructor(protected service: IBaseService<IUser>) {
    super(service);
  }
}
