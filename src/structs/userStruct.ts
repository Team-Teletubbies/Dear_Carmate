import {
  string,
  object,
  enums,
  optional,
  refine,
  nonempty,
  size,
  partial,
  define,
  nullable,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const userSearchKey = ['companyName', 'name', 'email'] as const;
export type UserSearchKey = (typeof userSearchKey)[number];
const Email = define<string>(
  'Email',
  (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
);

export const userFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(userSearchKey)),
});

const phoneNumber = refine(size(nonempty(string()), 1, 20), 'phoneNumber', (value) =>
  value.includes('-'),
);

const password = refine(size(nonempty(string()), 8, 16), 'password', (value) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(value),
);

export const createUserBodyStruct = object({
  name: size(nonempty(string()), 1, 10),
  email: Email,
  phoneNumber: phoneNumber,
  password: password,
  passwordConfirmation: password,
  employeeNumber: size(nonempty(string()), 4, 20),
  company: size(nonempty(string()), 1, 30),
  companyCode: size(nonempty(string()), 1, 30),
});

export const registerUserStruct = refine(createUserBodyStruct, 'passwordsMatch', (value) => {
  return value.password === value.passwordConfirmation;
});

export const updateUserBodyStruct = object({
  employeeNumber: size(string(), 4, 20),
  phoneNumber: phoneNumber,
  currentPassword: password,
  password: optional(password),
  passwordConfirmation: optional(password),
  imageUrl: nullable(string()),
});

// export const updateUserStruct = refine(updateUserBodyStruct, 'passwordMatch', (value) => {
//   return value.password === value.passwordConfirmation;
// });

export const loginBodyStruct = object({
  email: Email,
  password: password,
});

export const refreshTokenBodyStruct = object({
  refreshToken: nonempty(string()),
});
