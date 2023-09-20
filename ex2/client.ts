import { UserController } from "../ex2/controller/user-controller";
import { UserRepository } from "../ex2/repository/user-repository";
import { UserService } from "../ex2/service/user-service";
import { randomUUID } from "crypto";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

async function init() {
  return userController
    .save({ body: { id: randomUUID(), name: "René" } })
    .then((result) => console.log("Ex2: ", result));
}
init();
