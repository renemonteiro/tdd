import { IUser, IUserRepository } from "../repository/user-repository";

export interface IUserService {
  save(user: IUser): Promise<IUser>;
  edit(user: IUser): Promise<IUser>;
  getById(id: string): Promise<IUser | string>;
  delete(id: string): Promise<{ message: string }>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async save(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async edit(user: IUser): Promise<IUser> {
    return await this.userRepository.edit(user);
  }

  async getById(id: string): Promise<IUser | string> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      return "user not found";
    }
    return user;
  }

  async delete(id: string): Promise<{ message: string }> {
    return await this.userRepository.delete(id);
  }
}
