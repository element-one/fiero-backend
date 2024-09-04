import * as randomstring from 'randomstring';

export const isUUID = (value: string): boolean => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(value);
};

export const isValidEmail = (email: string): boolean => {
  const regexExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // regular expression to match valid email addresses

  return regexExp.test(email);
};

export const isTrue = (value?: string): boolean => value === 'true';

export const increaseGasPrice = (value: bigint, percent: number): bigint => {
  const originalValue = BigInt(value);
  const percentageIncrease = BigInt(percent);
  console.log(percentageIncrease);

  const increaseAmount = (originalValue * percentageIncrease) / BigInt(100);
  const increasedValue: bigint = originalValue + increaseAmount;
  return increasedValue;
};

export const randomString = (length: number): string => {
  return randomstring.generate(length);
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
