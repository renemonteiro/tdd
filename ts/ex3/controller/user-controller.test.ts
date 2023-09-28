import { describe, expect, test, beforeAll, vi, beforeEach } from "vitest";
import { randomUUID } from "crypto";
import { IBaseController } from "./interfaces/IBaseController";
import { IUser } from "../repository/user-repository";
import { IBaseService } from "../service/interface/IBaseService";
import { IBaseRepository } from "../repository/interface/IBaseReposiroty";
import { IValidate } from "../utils/validate";
import { UserController } from "./user-controller";
import { httpRequest, httpResponse } from "../http-protocols/http";

let userService: IBaseService<IUser>;
let userController: IBaseController<IUser>;

class ParamsValidate implements IValidate {
  validate() {
    return true;
  }
}
class BodyValidate implements IValidate {
  validate() {
    return true;
  }
}

class UserRepository extends IBaseRepository<IUser> {}
class UserService extends IBaseService<IUser> {
  constructor(protected userRepository: IBaseRepository<IUser>) {
    super(userRepository);
  }
  save(user: IUser): Promise<IUser> {
    return new Promise((resolve) => resolve(user));
  }
  edit(id: string, user: IUser): Promise<IUser> {
    return new Promise((resolve) => resolve(user));
  }
  getPaginated(
    page: number,
    itemsPerPage: number
  ): Promise<{ total: number; items: IUser[] }> {
    return new Promise((resolve) =>
      resolve({ total: 1, items: [{ id: "1", name: "Rene" }] })
    );
  }
  getAll(): Promise<IUser[]> {
    return new Promise((resolve) =>
      resolve([
        { id: "1", name: "René" },
        { id: "2", name: "René" },
      ])
    );
  }
  getById(id: string): Promise<IUser | { message: string }> {
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
  const bodyValidate = new BodyValidate();
  const paramsValidate = new ParamsValidate();
  const repo = new UserRepository();
  userService = new UserService(repo);
  userController = new UserController(
    userService,
    bodyValidate,
    paramsValidate
  );
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

  test("should throw an error id missing params", async () => {
    vi.spyOn(BodyValidate.prototype, "validate").mockImplementationOnce(() => {
      return false;
    });
    const req = {
      body: {
        name: "Rene",
      },
    };
    const result = await userController.save(req);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(new Error("missing arguments"));
  });

  test("should throw an error name missing params", async () => {
    vi.spyOn(BodyValidate.prototype, "validate").mockImplementationOnce(() => {
      return false;
    });
    const id = randomUUID();
    const req = {
      body: {
        id,
      },
    };
    const result = await userController.save(req);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(new Error("missing arguments"));
  });

  test("should edit an user", async () => {
    const reqSave = {
      body: { id: randomUUID(), name: "rene" },
    };
    const user = await userController.save(reqSave);
    expect(user.statusCode).toEqual(200);

    const reqEdit = {
      body: {
        id: user.body.id,
        name: user.body.name + " Edited",
      },
      params: user.body.id,
    };
    const userEdited = await userController.edit(reqEdit);
    expect(userEdited.statusCode).toEqual(200);
    expect(userEdited.body).toEqual(reqEdit.body);
  });

  test("should throw an error id missing params edit", async () => {
    vi.spyOn(BodyValidate.prototype, "validate").mockImplementationOnce(() => {
      return false;
    });
    const req = {
      body: {
        id: randomUUID(),
      },
    };
    const result = await userController.edit(req);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(new Error("missing arguments"));
  });

  test("Should delete an user", async () => {
    const id = randomUUID();
    const request = {
      body: {
        id,
        name: "User to delete",
      },
    };
    const user = await userController.save(request);
    const requestDelete = { params: user.body.id };
    const response = await userController.delete(requestDelete);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ message: "entity removed" });
  });

  test("Should throw an error id missing params delete", async () => {
    vi.spyOn(ParamsValidate.prototype, "validate").mockImplementationOnce(
      () => {
        return false;
      }
    );
    const id = randomUUID();
    const request = {
      body: { id, name: "invalid params" },
    };
    const response = await userController.delete(request);
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(new Error("missing params"));
  });

  test("Should get an user by id", async () => {
    const user = await userController.save({
      body: { id: randomUUID(), name: "Rene" },
    });
    const req = {
      params: { id: user.body.id },
    };
    const userFound = await userController.getById(req);

    expect(userFound.statusCode).toEqual(200);
    expect(userFound.body).toEqual(user.body);
  });

  test("Should throw an error to get an user by id", async () => {
    const invalidId = randomUUID();
    vi.spyOn(UserService.prototype, "getById").mockReturnValue(
      new Promise((resolve) => resolve({ message: "entity not found" }))
    );

    const user = await userController.getById({ params: invalidId });

    expect(user.body).toEqual({ message: "entity not found" });
  });

  test("Should return all users", async () => {
    const response: httpResponse<IUser[]> = await userController.getAll();

    const target: httpResponse<IUser[]> = {
      body: [
        { id: "1", name: "René" },
        { id: "2", name: "René" },
      ],
      statusCode: 200,
    };
    expect(response).toEqual(target);
  });

  test("Should return users paginated", async () => {
    const request: httpRequest = {
      params: { page: 1, itemsPerPage: 10 },
    };
    const response = await userController.getPaginated(request);

    const target: httpResponse<{ total: number; items: IUser[] }> = {
      statusCode: 200,
      body: {
        total: 1,
        items: [{ id: "1", name: "Rene" }],
      },
    };
    expect(response).toEqual(target);
  });
});
