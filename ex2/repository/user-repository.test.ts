import { beforeEach, describe, expect, test, vi } from "vitest";
import { randomUUID } from "crypto";
import { UserRepository, IUser, IUserRepository } from "./user-repository";

let user: IUser;
let userRepository: IUserRepository;
let dataBuilder: DataBuilder;

class DataBuilder {
  private userRepository: IUserRepository = new UserRepository();

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
    const userEdited = await userRepository.edit(newUser);
    expect(userEdited).toEqual({ id: newUser.id, name: "René edited" });
  });
  test("should delete an user", async () => {
    const newUser = await userRepository.save(user);
    const result = await userRepository.delete(newUser.id);
    expect(result).toEqual({ message: "entity removed" });
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
});
