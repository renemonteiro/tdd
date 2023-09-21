import {
  fail,
  httpBodyRequest,
  httpResponse,
  ok,
  httpParamsRequest,
} from "../../http-protocols/http";
import { IBaseService } from "../../service/interface/IBaseService";
import { IValidate } from "../../utils/validate";
export interface hasId {
  id: string;
}
export abstract class IBaseController<T extends hasId> {
  constructor(
    protected baseService: IBaseService<T>,
    protected validateParams: IValidate
  ) {}
  async save(httpRequest: httpBodyRequest<T>): Promise<httpResponse<T>> {
    try {
      const body = httpRequest.body;
      const hasCorrectParams = this.validateParams.validate(httpRequest);
      if (!hasCorrectParams) {
        throw new Error("missing arguments");
      }

      const response = await this.baseService.save(body);
      return ok(response);
    } catch (error) {
      return fail(error);
    }
  }
  async edit(httpRequest: httpBodyRequest<T>): Promise<httpResponse<T>> {
    try {
      const id = httpRequest.body;
      if (!this.validateParams.validate(httpRequest)) {
        throw new Error("missing arguments");
      }

      const result = await this.baseService.edit(id);
      return ok(result);
    } catch (error) {
      return fail(error);
    }
  }

  async getById(
    httpRequest: httpParamsRequest
  ): Promise<httpResponse<T | string>> {
    try {
      const id = httpRequest.params;
      const entity = await this.baseService.getById(id);
      if (!entity) {
        throw new Error("entity not found");
      }
      return ok(entity);
    } catch (error) {
      return fail(error);
    }
  }

  async delete(
    httpParamsRequest: httpParamsRequest
  ): Promise<httpResponse<{ message: string }>> {
    try {
      const id = httpParamsRequest.params;
      if (this.validateParams.validate(httpParamsRequest)) {
        throw new Error("missing params");
      }
      const result = await this.baseService.delete(id);
      return ok(result);
    } catch (error) {
      return fail(error);
    }
  }
}
