import { Role } from '../../common/enums/role.enum';

export const predefinedUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'prosightAdmin111',
    role: Role.ADMIN,
  },
  {
    id: 2,
    username: 'normal',
    password: 'prosightNormal222',
    role: Role.NORMAL,
  },
  {
    id: 3,
    username: 'limited',
    password: 'prosightLimited333',
    role: Role.LIMITED,
  },
];
