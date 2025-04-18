import {
  string,
  object,
  enums,
  optional,
  refine,
  nonempty,
  max,
  defaulted,
  size,
  partial,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const userSeachKey = ['companyName', 'name', 'email'] as const;

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
  company: size(nonempty(string()), 1, 30),
  companyCode: size(nonempty(string()), 1, 30),
});

export const registerUserStruct = refine(createUserBodyStruct, 'passwordsMatch', (value) => {
  return value.password === value.passwordConfirmation;
});
