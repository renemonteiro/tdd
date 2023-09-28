import {} from "../../decorator/fields";
import {
  httpRequest,
  httpResponse,
  resolve,
  reject,
} from "../../http-protocols/http";
import { IBaseService } from "../../service/interface/IBaseService";
import { IValidate } from "../../utils/validate";
export interface hasId {
  id: string;
}
export abstract class IBaseController<T extends hasId> {
  constructor(
    protected baseService: IBaseService<T>,
    protected bodyValidate: IValidate,
    protected paramsValidate: IValidate
  ) {}

  async save(httpRequest: httpRequest): Promise<httpResponse<T>> {
    try {
      const body = httpRequest.body;
      const hasCorrectParams = this.bodyValidate.validate(httpRequest);
      if (!hasCorrectParams) {
        throw new Error("missing arguments");
      }

      const response = await this.baseService.save(body);
      return resolve(response);
    } catch (error) {
      return reject(error);
    }
  }
  async edit(httpRequest: httpRequest): Promise<httpResponse<T>> {
    try {
      const id = httpRequest.params;
      if (!this.bodyValidate.validate(httpRequest)) {
        throw new Error("missing arguments");
      }
      if (!this.paramsValidate.validate(httpRequest)) {
        throw new Error("missing params");
      }

      const result = await this.baseService.edit(id, httpRequest.body);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  }
  async getAll(): Promise<httpResponse<T[]>> {
    try {
      const users = await this.baseService.getAll();
      return resolve(users);
    } catch (error) {
      return reject(error);
    }
  }

  async getById(
    httpRequest: httpRequest
  ): Promise<httpResponse<T | { message: string }>> {
    try {
      if (!this.paramsValidate.validate(httpRequest)) {
        throw new Error("missing params");
      }
      const { id } = httpRequest.params;
      const entity = await this.baseService.getById(id);
      if (!entity) {
        throw new Error("entity not found");
      }
      return resolve(entity);
    } catch (error) {
      return reject(error);
    }
  }

  async delete(
    httpRequest: httpRequest
  ): Promise<httpResponse<{ message: string }>> {
    try {
      const hasParams = this.paramsValidate.validate(httpRequest);
      if (!hasParams) {
        throw new Error("missing params");
      }
      const { id } = httpRequest.params;

      const result = await this.baseService.delete(id);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  }
}
