import { IUser } from "../repository/user-repository";
import { IUserService } from "../service/user-service";

export type httpParamsRequest = {
  params: string;
};
export type httpBodyRequest<T> = {
  body: T;
};
export type httpRequest<T> = httpParamsRequest & httpBodyRequest<T>;

export type httpResponse<T> = {
  statusCode: number;
  body: T;
};

const ok = <T>(data: T): httpResponse<T> => ({
  statusCode: 200,
  body: data,
});

const fail = (data: any) => ({
  statusCode: 500,
  body: data,
});

export interface IBaseController<T> {
  save(httpRequest: httpBodyRequest<T>): Promise<httpResponse<T>>;
  edit(httpRequest: httpBodyRequest<T>): Promise<httpResponse<T>>;
  delete(httpRequest: httpParamsRequest): Promise<httpResponse<string>>;
  getById(httpRequest: httpParamsRequest): Promise<httpResponse<T | string>>;
}
export class UserController implements IBaseController<IUser> {
  constructor(private userService: IUserService) {}

  async save(
    httpRequest: httpBodyRequest<IUser>
  ): Promise<httpResponse<IUser>> {
    try {
      const { id, name } = httpRequest.body;
      if (!name || !id) {
        throw new Error("missing params");
      }
      const user = httpRequest.body;

      const a = await this.userService.save(user);
      return ok(a);
    } catch (error) {
      return fail(error);
    }
  }
  async edit(
    httpRequest: httpBodyRequest<IUser>
  ): Promise<httpResponse<IUser>> {
    const { id, name } = httpRequest.body;
    try {
      if (!id || !name) {
        throw new Error("missing params");
      }
      const response = await this.userService.edit({ id, name });
      return ok(response);
    } catch (error) {
      return fail(error);
    }
  }
  async delete(httpRequest: httpParamsRequest): Promise<httpResponse<string>> {
    const params = httpRequest.params;
    try {
      if (!params) {
        throw new Error("missing params");
      }
      const response = await this.userService.delete(params);
      return ok(response.message);
    } catch (error) {
      return fail(error);
    }
  }
  async getById(
    httpRequest: httpParamsRequest
  ): Promise<httpResponse<IUser | string>> {
    try {
      const id = httpRequest.params;
      const user = await this.userService.getById(id);
      if (!user) {
        throw new Error("user not found");
      }
      return ok(user);
    } catch (error) {
      return fail(error);
    }
  }
}
