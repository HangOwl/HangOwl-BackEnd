import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        role: 1
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
        role: 2
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
        role: 3
      },
    ];
  }

  // if has database ( need to return userData , password ,salt )
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}