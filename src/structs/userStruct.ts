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
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const userSeachKey = ['companyName', 'name', 'email'] as const;

// 조금 더 정교한 형태로 Email 재정의
const Email = define<string>(
  'Email',
  (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
);

export const userFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(userSeachKey)),
});

const email = refine(size(nonempty(string()), 1, 30), 'email', (value) => value.includes('@'));

const phoneNumber = refine(size(nonempty(string()), 1, 20), 'phoneNumber', (value) =>
  value.includes('-'),
);

const password = refine(size(nonempty(string()), 8, 16), 'password', (value) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(value),
);

export const createUserBodyStruct = object({
  name: size(nonempty(string()), 1, 10),
  email: email,
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

export const updateUserBodyStruct = partial(createUserBodyStruct);
