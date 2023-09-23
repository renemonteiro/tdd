import { describe, expect, test, beforeAll, vi } from "vitest";
import { randomUUID } from "crypto";
import {
  IBaseController,
  UserController,
  httpBodyRequest,
} from "./user-controller";
import { IUser } from "../repository/user-repository";
import { IUserService } from "../service/user-service";

let userService;
let userController: IBaseController<IUser>;
class UserService implements IUserService {
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
  userService = new UserService();
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
  test("Should throw an error when id is missing", async () => {
    const requestMissinParams = {
      body: {
        name: "Rene",
      },
    };
    const result = await userController.save(requestMissinParams);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(new Error("missing params"));
  });
  test("Should throw an error when name is missing", async () => {
    const requestMissinParams = {
      body: {
        name: "Rene",
      },
    };
    const response = await userController.save(requestMissinParams);
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(new Error("missing params"));
  });
  test("should edit an user", async () => {
    const user = await userController.save({
      body: { id: randomUUID(), name: "rene" },
    });
    const req: httpBodyRequest<IUser> = {
      body: {
        id: user.body.id,
        name: user.body.name + " Edited",
      },
    };
    const userEdited = await userController.edit(req);
    expect(userEdited.statusCode).toEqual(200);
    expect(userEdited.body).toEqual(req.body);
  });
  test("Should throw an error when id is missing", async () => {
    const requestMissingParams = {
      body: {
        name: "user.body.name",
      },
    };
    const user = await userController.edit(requestMissingParams);
    expect(user.statusCode).toEqual(500);
    expect(user.body).toEqual(new Error("missing params"));
  });
  test("Should throw an error when name is missing", async () => {
    const requestMissingParams = {
      body: {
        id: randomUUID(),
      },
    };
    const user = await userController.edit(requestMissingParams);
    expect(user.statusCode).toEqual(500);
    expect(user.body).toEqual(new Error("missing params"));
  });
  test("Should delete an user", async () => {
    const request = {
      params: "1",
    };
    const response = await userController.delete(request);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("entity removed");
  });
  test("Should throw an error when id is missing", async () => {
    const req = {
      body: {},
    };
    const response = await userController.delete(req);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(new Error("missing params"));
  });
  test("Should get an user by id", async () => {
    const user = await userController.save({
      body: { id: randomUUID(), name: "Rene" },
    });
    const id = user.body.id;
    const userFound = await userController.getById({
      params: id,
    });

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
