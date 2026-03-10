import { Injectable } from '@nestjs/common';
import { predefinedUsers } from '../auth/constants/predefined-users';

@Injectable()
export class UsersService {
  findByUsername(username: string) {
    return predefinedUsers.find(user => user.username === username) ?? null;
  }

  findById(id: number) {
    return predefinedUsers.find(user => user.id === id) ?? null;
  }
}
