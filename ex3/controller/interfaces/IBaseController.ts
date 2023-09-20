import { IBaseService } from "../../service/interface/IBaseService";

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

export const ok = <T>(data: T): httpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export type httpResponseError = {
  statusCode: number;
  body: any;
};
export const fail = (data: any): httpResponseError => ({
  statusCode: 500,
  body: data,
});

export interface hasId {
  id: string;
}
export abstract class IBaseController<T extends hasId> {
  constructor(protected baseService: IBaseService<T>) {}
  async save(httpRequest: httpBodyRequest<T>): Promise<httpResponse<T>> {
    try {
      const body = httpRequest.body;

      const response = await this.baseService.save(body);
      return ok(response);
    } catch (error) {
      return fail(error);
    }
  }
  async edit(httpRequest: httpBodyRequest<T>): Promise<httpResponse<T>> {
    try {
      const id = httpRequest.body;

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
      const result = await this.baseService.delete(id);
      return ok(result);
    } catch (error) {
      return fail(error);
    }
  }
}
