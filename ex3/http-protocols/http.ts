export type httpParamsRequest = {
  params: string;
};
export type httpBodyRequest<T> = {
  body: T;
};
export type http = {
  body?: any;
  params?: any;
  query?: any;
};
export type httpRequest<T> = httpParamsRequest & httpBodyRequest<T>;

export type httpResponse<T> = {
  statusCode: number;
  body: T;
};

export const resolve = <T>(data: T): httpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export type httpResponseError = {
  statusCode: number;
  body: any;
};
export const reject = (data: any): httpResponseError => ({
  statusCode: 500,
  body: data,
});
