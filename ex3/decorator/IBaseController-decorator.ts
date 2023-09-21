import { bodyValidationDecorator, parmasValidationDecorator } from "./fields";
import { reject, httpResponse, resolve } from "../http-protocols/http";
import { IBaseService } from "../service/interface/IBaseService";
export type httpRequest = {
  body: any;
  params: any;
  query: any;
};
export interface hasId {
  id: string;
}

export abstract class IBaseController<T extends hasId> {
  constructor(protected baseService: IBaseService<T>) {}

  @bodyValidationDecorator("id", "name")
  async save(httpRequest: httpRequest): Promise<httpResponse<T>> {
    try {
      const body = httpRequest.body;
      const response = await this.baseService.save(body);
      return resolve(response);
    } catch (error) {
      return reject(error);
    }
  }
  @bodyValidationDecorator("id", "name")
  @parmasValidationDecorator()
  async edit(httpRequest: httpRequest): Promise<httpResponse<T>> {
    try {
      const id = httpRequest.params;
      const result = await this.baseService.edit(id, httpRequest.body);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  }

  @parmasValidationDecorator()
  async getById(httpRequest: httpRequest): Promise<httpResponse<T | string>> {
    try {
      const id = httpRequest.params;
      const entity = await this.baseService.getById(id);

      return resolve(entity);
    } catch (error) {
      return reject(error);
    }
  }

  @parmasValidationDecorator()
  async delete(
    httpParamsRequest: httpRequest
  ): Promise<httpResponse<{ message: string }>> {
    try {
      const id = httpParamsRequest.params;

      const result = await this.baseService.delete(id);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  }
}
