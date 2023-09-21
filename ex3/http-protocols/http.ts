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
