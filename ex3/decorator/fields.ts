import { httpBodyRequest } from "../http-protocols/http";
import {
  FieldsValidation,
  IValidate,
  ParamsValidation,
  ValidateComposite,
} from "../utils/validate";

export function bodyValidationDecorator<T>(...properties: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (httpRequest: httpBodyRequest<T>) {
      const listToValidate: IValidate[] = [];
      for (const property of properties) {
        listToValidate.push(new FieldsValidation(property));
      }
      const hasCorrectParams = new ValidateComposite(...listToValidate);
      if (!hasCorrectParams) {
        throw new Error(`DECORATOR missing arguments`);
      }

      const response = await originalMethod.call(this, httpRequest);
      return response;
    };

    return descriptor;
  };
}
export function parmasValidationDecorator<T>() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (httpRequest: httpBodyRequest<T>) {
      const field = new ParamsValidation();
      const hasCorrectParams = field.validate(httpRequest);
      if (!hasCorrectParams) {
        throw new Error(`missing params argument `);
      }

      const response = await originalMethod.call(this, httpRequest);
      return response;
    };

    return descriptor;
  };
}
