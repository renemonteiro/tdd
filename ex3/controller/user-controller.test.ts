import { describe, expect, test, beforeAll, vi } from "vitest";
import { randomUUID } from "crypto";
import { IBaseController } from "./interfaces/IBaseController";
import { IUser } from "../repository/user-repository";
import { IBaseService } from "../service/interface/IBaseService";
import { IBaseRepository } from "../repository/interface/IBaseReposiroty";
import { UserController } from "./user-controller";

let userService: IBaseService<IUser>;
let userController: IBaseController<IUser>;

class UserRepository extends IBaseRepository<IUser> {}
class UserService extends IBaseService<IUser> {
  constructor(protected userRepository: IBaseRepository<IUser>) {
    super(userRepository);
  }
  save(user: IUser): Promise<IUser> {
    return new Promise((resolve) => resolve(user));
  }
  edit(user: IUser): Promise<IUser> {
    return new Promise((resolve) => resolve(user));
  }
  getById(id: string): Promise<IUser | string> {
    const user = {
      id,
      name: "Rene",
    };
    return new Promise((resolve) => resolve(user));
  }
  delete(id: string): Promise<{ message: string }> {
    return new Promise((resolve) => resolve({ message: "entity removed" }));
  }
}

beforeAll(() => {
  const repo = new UserRepository();
  userService = new UserService(repo);
  userController = new UserController(userService);
});

describe("User Controller", () => {
  test("Should save an user", async () => {
    const id = randomUUID();
    const req = {
      body: {
        id: id,
        name: "rene Mock",
      },
    };
    const response = await userController.save(req);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(req.body);
  });

  test("should edit an user", async () => {
    const user = await userController.save({
      body: { id: randomUUID(), name: "rene" },
    });
    expect(user.statusCode).toEqual(200);
    const req = {
      body: {
        id: user.body.id,
        name: user.body.name + " Edited",
      },
    };
    const userEdited = await userController.edit(req);
    expect(userEdited.statusCode).toEqual(200);
    expect(userEdited.body).toEqual(req.body);
  });

  test("Should delete an user", async () => {
    const id = randomUUID();
    const request = {
      params: id,
    };
    const response = await userController.delete(request);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ message: "entity removed" });
  });

  test("Should get an user by id", async () => {
    const user = await userController.save({
      body: { id: randomUUID(), name: "Rene" },
    });
    const req = {
      params: user.body.id,
    };
    const userFound = await userController.getById(req);

    expect(userFound.statusCode).toEqual(200);
    expect(userFound.body).toEqual(user.body);
  });

  test("Should throw an error to get an user by id", async () => {
    const invalidId = randomUUID();
    vi.spyOn(UserService.prototype, "getById").mockReturnValue(
      new Promise((resolve) => resolve("entity not found"))
    );

    const user = await userController.getById({ params: invalidId });

    expect(user.body).toEqual("entity not found");
  });
});
