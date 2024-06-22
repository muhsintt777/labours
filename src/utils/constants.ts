export const ERROR_MESSAGES = {
  EMPTY_RESPONSE: "Empty response",
};

export const REGEX = {
  EMAIL: /^[\w.-]+@[\w.-]+\.\w{2,}$/i,
  FULL_NAME: /^[a-zA-Z\s,'-]+$/,
  PHONE_NUMBER: /^\+?\d{1,3}?[-. (]?\d{3}[-. )]?\d{3}[-. ]?\d{4}$/,
  JOB_DESCRIPION: /^\s*\w+(\s*\w+)*(\s*,\s*\w+(\s*\w+)*)*\s*$/,
};

export const USER_TYPE = {
  CUSTOMER: 1,
  CONTRACTOR: 2,
};
