import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        Email: 'john',
        password: 'changeme',
        Role: 1
      },
      {
        id: 2,
        Email: 'chris',
        password: 'secret',
        Role: 2
      },
      {
        id: 3,
        Email: 'maria',
        password: 'guess',
        Role: 3
      },
    ];
  }

  // if has database ( need to return userData , password ,salt )
  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.Email === email );
  }
}