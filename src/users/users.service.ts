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
        Password: 'changeme',
        Role: 1 ,
        Detail: 'Hello'
      },
      {
        id: 2,
        Email: 'chris',
        Password: 'secret',
        Role: 2 ,
        Detail: 'Hello'
      },
      {
        id: 3,
        Email: 'maria',
        Password: 'guess',
        Role: 3 ,
        Detail: 'Hello'
      },
    ];
  }

  // if has database ( need to return userData , password ,salt )
  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.Email === email );
  }
}