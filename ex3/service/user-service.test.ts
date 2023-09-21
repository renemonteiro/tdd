import { beforeEach, describe, expect, test, vi } from "vitest";
import { randomUUID } from "crypto";
import { UserService } from "./user-service";
import { IUser } from "../repository/user-repository";
import { IBaseService } from "./interface/IBaseService";
import { IBaseRepository } from "../repository/interface/IBaseReposiroty";

let user: IUser;
let userService: IBaseService<IUser>;
let dataBuilder: DataBuilder;

class DataBuilder {
  private userService: IBaseService<IUser> = new UserService(
    new UserRepositoryDuble()
  );
  constructor() {}
  async add(...users: IUser[]): Promise<this> {
    for (const user of users) {
      await this.userService.save(user);
    }
    return this;
  }
  getUserService() {
    return this.userService;
  }
}

class UserRepositoryDuble extends IBaseRepository<IUser> {
  save(user: IUser): Promise<IUser> {
    return new Promise((resolve) => resolve(user));
  }
  getById(id: string): Promise<IUser | undefined> {
    return new Promise((resolve) =>
      resolve({
        id,
        name: "René",
      })
    );
  }
  edit(id: string, user: IUser): Promise<IUser> {
    return new Promise((resolve) => resolve(user));
  }
  getList(): Promise<IUser[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<{ message: string }> {
    return new Promise((resolve) => resolve({ message: `entity removed` }));
  }
}

beforeEach(() => {
  user = { id: randomUUID(), name: "René" };
  userService = new UserService(new UserRepositoryDuble());
  dataBuilder = new DataBuilder();
});
describe("User service", () => {
  test("just test the DataBuilder Class", async () => {
    vi.spyOn(UserRepositoryDuble.prototype, "save");
    //execute a console.log on userService file to view the loop
    for (let x = 0; x < 5; x++) {
      await dataBuilder.add({ id: randomUUID(), name: "a: " + x.toString() });
    }
    expect(UserRepositoryDuble.prototype.save).toHaveBeenCalledTimes(5);
  });
  test("Should save an user", async () => {
    const newUser = await userService.save(user);
    expect(newUser).toEqual(user);
  });
  test("Should throw an error", async () => {
    vi.spyOn(UserRepositoryDuble.prototype, "save").mockImplementationOnce(
      () => {
        throw new Error("try again");
      }
    );
    await expect(userService.save(user)).rejects.toThrow();
    expect(UserRepositoryDuble.prototype.save).toHaveBeenCalled();
    expect(UserRepositoryDuble.prototype.save).toHaveBeenCalledOnce();
    expect(UserRepositoryDuble.prototype.save).toHaveBeenCalledWith(user);
  });

  test("should get an user by id", async () => {
    vi.spyOn(UserRepositoryDuble.prototype, "getById");
    await userService.save(user);

    const userWanted = await userService.getById(user.id);

    expect(userWanted).toEqual(user);
    expect(UserRepositoryDuble.prototype.getById).toHaveBeenCalled();
    expect(UserRepositoryDuble.prototype.getById).toHaveBeenCalledOnce();
    expect(UserRepositoryDuble.prototype.getById).toHaveBeenCalledWith(user.id);
  });

  test("should throw an error to get an user by id", async () => {
    vi.spyOn(UserRepositoryDuble.prototype, "getById").mockImplementationOnce(
      () => {
        throw new Error("a");
      }
    );
    await expect(userService.getById(user.id)).rejects.toThrow();
    expect(UserRepositoryDuble.prototype.getById).toHaveBeenCalledOnce();
    expect(UserRepositoryDuble.prototype.getById).toBeCalledWith(user.id);
  });

  test("should delete an user", async () => {
    const result = await userService.delete(user.id);
    expect(result).toEqual({ message: `entity removed` });
  });
  test("should throw an error when delete an user", async () => {
    vi.spyOn(UserRepositoryDuble.prototype, "delete").mockImplementationOnce(
      async () => {
        throw new Error("error");
      }
    );
    await expect(userService.delete(user.id)).rejects.toThrow();

    expect(UserRepositoryDuble.prototype.delete).toHaveBeenCalled();
    expect(UserRepositoryDuble.prototype.delete).toHaveBeenCalledOnce();
    expect(UserRepositoryDuble.prototype.delete).toBeCalledWith(user.id);
  });

  test("should edit an user", async () => {
    const newUser = await userService.save(user);
    const editedUser = {
      id: newUser.id,
      name: "René edited",
    };
    const result = await userService.edit(newUser.id, editedUser);
    expect(result).toEqual(editedUser);
  });
  test("should throw an error when edit", async () => {
    vi.spyOn(UserRepositoryDuble.prototype, "edit").mockImplementationOnce(
      () => {
        throw new Error("error");
      }
    );
    await expect(userService.edit(user.id, user)).rejects.toThrow();
    expect(UserRepositoryDuble.prototype.edit).toHaveBeenCalled();
    expect(UserRepositoryDuble.prototype.edit).toHaveBeenCalledOnce();
    expect(UserRepositoryDuble.prototype.edit).toHaveBeenCalledWith(
      user.id,
      user
    );
  });
});
