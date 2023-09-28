import { beforeEach, describe, expect, test, vi } from "vitest";
import { randomUUID } from "crypto";
import { UserRepository } from "./user-repository";
import { IUser } from "./user-repository";
import { IBaseRepository } from "./interface/IBaseReposiroty";

let user: IUser;
let userRepository: IBaseRepository<IUser>;
let dataBuilder: DataBuilder;

class DataBuilder {
  protected userRepository: IBaseRepository<IUser> = new UserRepository();

  constructor() {}

  async add(...users: IUser[]): Promise<this> {
    for (const user of users) {
      await this.userRepository.save(user);
    }
    return this;
  }
  async getList(): Promise<IUser[]> {
    return await this.userRepository.getList();
  }
}

beforeEach(() => {
  user = { id: randomUUID(), name: "René" };
  userRepository = new UserRepository();
  dataBuilder = new DataBuilder();
});

describe("Repository", () => {
  test("Should save an user", async () => {
    const result = await userRepository.save(user);
    expect(result).toEqual(user);
  });

  test("should get an user by id", async () => {
    const { id } = await userRepository.save(user);
    const newUser = await userRepository.getById(id);
    expect(newUser?.id).toEqual(id);
  });
  test("should edit an user", async () => {
    const newUser = await userRepository.save(user);
    newUser.name += " edited";
    const userEdited = await userRepository.edit(newUser.id, newUser);
    expect(userEdited).toEqual({ id: newUser.id, name: "René edited" });
  });
  test("sloud delete an user", async () => {
    const newUser = await userRepository.save(user);
    const result = await userRepository.delete(newUser.id);
    expect(result).toEqual({ message: "entity not found" });
  });
  test("should have ten users saved", async () => {
    vi.spyOn(UserRepository.prototype, "save");
    for (let x = 0; x < 10; x++) {
      await dataBuilder.add({ name: "1", id: "1" });
    }
    const list = await dataBuilder.getList();

    expect(list.length).toEqual(10);
    expect(UserRepository.prototype.save).toHaveBeenCalledTimes(10);
  });

  test("Should return all users", async () => {
    for (let x = 0; x < 10; x++) {
      await userRepository.save({ id: x.toString(), name: "Rene" + x });
    }
    const users = await userRepository.getAll();
    expect(users).length(10);
  });

  test("should return users paginated", async () => {
    const total = 10;
    const page = 1;
    const userPerPage = 10;
    const target = [];
    for (let x = 0; x < total; x++) {
      let user = await userRepository.save({
        id: x.toString(),
        name: "Rene" + x,
      });
      target.push(user);
    }
    const users = await userRepository.getPaginated(page, userPerPage);
    expect(users).toEqual({
      total: total,
      items: target,
    });
  });
  test("should return users paginated", async () => {
    const total = 20;
    const page = 2;
    const userPerPage = 10;
    const target = [];
    for (let x = 0; x < total; x++) {
      let user = await userRepository.save({
        id: x.toString(),
        name: "Rene" + x,
      });
      target.push(user);
    }
    const items = target.slice(10);
    const users = await userRepository.getPaginated(page, userPerPage);
    expect(users).toEqual({
      total,
      items,
    });
  });
});
