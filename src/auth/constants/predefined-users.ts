import { Role } from '../../common/enums/role.enum';

export const predefinedUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: Role.ADMIN,
  },
  {
    id: 2,
    username: 'normal',
    password: 'normal123',
    role: Role.NORMAL,
  },
  {
    id: 3,
    username: 'limited',
    password: 'limited123',
    role: Role.LIMITED,
  },
];
