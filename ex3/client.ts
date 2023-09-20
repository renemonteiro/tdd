import { UserController } from "./controller/user-controller";
import { UserRepository } from "./repository/user-repository";
import { UserService } from "./service/user-service";
import { randomUUID } from "crypto";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

async function init() {
  return userController
    .save({ body: { id: randomUUID(), name: "René" } })
    .then((result) => console.log("Ex3: ", result));
}
init();
