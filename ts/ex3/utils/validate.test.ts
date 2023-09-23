import { describe, expect, test } from "vitest";
import {
  FieldsValidation,
  ParamsValidation,
  ValidateComposite,
} from "./validate";

describe("Validate Class", () => {
  test("Should validate the properties from body", async () => {
    const validate = new FieldsValidation("name");
    const req = {
      body: {
        name: "René",
        email: "rene@mail.com",
      },
    };
    const result = validate.validate(req);
    expect(result).toBeTruthy();
  });
  test("Should throw an error missing property email from body", async () => {
    const validateEmail = new FieldsValidation("email");

    const req1 = {
      body: {
        name: "René",
      },
    };
    const emailResult = validateEmail.validate(req1);
    expect(emailResult).toEqual(false);
  });
  test("Should throw an error missing property name from body", async () => {
    const emailValidate = new FieldsValidation("name");

    const req2 = {
      body: {
        email: "rene@mail.com",
      },
    };
    const nameResult = emailValidate.validate(req2);
    expect(nameResult).toEqual(false);
  });
  test("Should validate the params", () => {
    const paramsValidation = new ParamsValidation();
    const req = {
      params: 1,
    };
    const result = paramsValidation.validate(req);
    expect(result).toBeTruthy();
  });
  test("Should throw an error from invalid params", () => {
    const paramsValidation = new ParamsValidation();
    const req = {
      body: {
        id: 1,
      },
    };
    const result = paramsValidation.validate(req);
    expect(result).toBeFalsy();
  });
  test("Should handler a validate composite", () => {
    const nameFields = new FieldsValidation("name");
    const idFields = new FieldsValidation("id");
    const paramsField = new ParamsValidation();
    const req = {
      body: {
        id: 1,
        name: "René",
      },
      params: 1,
    };

    const composite = new ValidateComposite(idFields, nameFields, paramsField);
    const resultComposite = composite.validate(req);
    expect(resultComposite).toBeTruthy();
  });
  test("Should throw an error missing params id", () => {
    const idFields = new FieldsValidation("id");
    const nameFields = new FieldsValidation("name");
    const paramsField = new ParamsValidation();
    const req = {
      body: {
        name: "René",
      },
      params: 1,
    };

    const composite = new ValidateComposite(idFields, nameFields, paramsField);
    const resultComposite = composite.validate(req);
    expect(resultComposite).toBeFalsy();
  });
  test("Should throw an error missing params name", () => {
    const idFields = new FieldsValidation("id");
    const nameFields = new FieldsValidation("name");
    const paramsField = new ParamsValidation();
    const req = {
      body: {
        id: 1,
      },
      params: 1,
    };

    const composite = new ValidateComposite(idFields, nameFields, paramsField);
    const resultComposite = composite.validate(req);
    expect(resultComposite).toBeFalsy();
  });
  test("Should throw an error missing params", () => {
    const idFields = new FieldsValidation("id");
    const nameFields = new FieldsValidation("name");
    const paramsField = new ParamsValidation();
    const req = {
      body: {
        id: 1,
        name: "René",
      },
    };

    const composite = new ValidateComposite(idFields, nameFields, paramsField);
    const resultComposite = composite.validate(req);
    expect(resultComposite).toBeFalsy();
  });
});
