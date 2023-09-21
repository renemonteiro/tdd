import { UserController } from "./controller/user-controller";
import { UserRepository } from "./repository/user-repository";
import { UserService } from "./service/user-service";
import { randomUUID } from "crypto";
import { FieldsValidation, ValidateComposite } from "./utils/validate";

const IdValidate = new FieldsValidation("id");
const nameValidate = new FieldsValidation("name");
const compositeParams = new ValidateComposite(IdValidate, nameValidate);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userController = new UserController(userService, compositeParams);
const req = { body: { id: randomUUID(), name: "René" }, params: 1 };

async function init() {
  return userController
    .save(req)
    .then((result) => console.log("Ex3: ", result));
}
init();
