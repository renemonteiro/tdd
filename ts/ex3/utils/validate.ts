export interface IValidate {
  validate(input: any): boolean;
}

export class FieldsValidation implements IValidate {
  constructor(private readonly field: string) {}
  validate(input: any): boolean {
    const hasField = input.body[this.field];
    return !!hasField;
  }
}

export class ParamsValidation implements IValidate {
  validate(input: any): boolean {
    const hasParams = input["params"];
    return !!hasParams;
  }
}

export class ValidateComposite implements IValidate {
  private readonly validationList: IValidate[];
  constructor(...validationList: IValidate[]) {
    this.validationList = validationList;
  }
  validate(input: any): boolean {
    for (const item of this.validationList) {
      const isValid = item.validate(input);
      if (!isValid) {
        return false;
      }
    }
    return true;
  }
}
