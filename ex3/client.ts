import { UserRepository } from "./repository/user-repository";
import { UserService } from "./service/user-service";
import { randomUUID } from "crypto";
import {
  FieldsValidation,
  ParamsValidation,
  ValidateComposite,
} from "./utils/validate";
import { UserController } from "./controller/user-controller";
import { http } from "./http-protocols/http";

const IdValidate = new FieldsValidation("id");
const nameValidate = new FieldsValidation("name");

const params = new ParamsValidation();
const compositeParams = new ValidateComposite(IdValidate, nameValidate);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userController = new UserController(userService, compositeParams, params);

class Client {
  private readonly id = randomUUID;

  async save(req: http) {
    const result = await userController.save(req);
    console.log("save", result);
    return this;
  }
  async edit(req: http) {
    const result = await userController.edit(req);
    console.log("edit", result);
    return this;
  }
  async getById(req: http) {
    const result = await userController.getById(req);
    console.log("getById", result);
    return this;
  }
  async delete(req: http) {
    const result = await userController.delete(req);
    console.log("delete", result);
    return this;
  }
  async start() {
    let reqSave = {
      body: { id: this.id(), name: "René" },
    };
    this.save(reqSave);
    const idEdit = this.id();
    let reqEdit = {
      body: { id: idEdit, name: "René Edited" },
      params: { id: idEdit },
    };
    this.edit(reqEdit);

    let reqGetById = {
      params: { id: idEdit },
    };
    this.getById(reqGetById);

    let reqDelete = {
      params: { id: this.id() },
    };
    this.delete(reqDelete);
  }
}
const client = new Client();
client.start();
