import { IUser } from "../repository/user-repository";
import { IBaseService } from "../service/interface/IBaseService";
import { IValidate } from "../utils/validate";
import { IBaseController } from "./interfaces/IBaseController";

export class UserController extends IBaseController<IUser> {
  constructor(
    protected service: IBaseService<IUser>,
    protected bodyValidate: IValidate,
    protected paramsValidate: IValidate
  ) {
    super(service, bodyValidate, paramsValidate);
  }
}
