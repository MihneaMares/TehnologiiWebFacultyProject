import validator from 'validator';
const isEmail = (value) => validator.isEmail(value);
const isValidPassForLogin = (value) => value.length >= 8;
const isValidPassForRegister = (value) => validator.isStrongPassword(value);

export { isEmail, isValidPassForLogin, isValidPassForRegister };
