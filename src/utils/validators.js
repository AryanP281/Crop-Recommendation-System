export const emailValidator = (email, emptyError, validErrror) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return emptyError;
  if (!re.test(email)) return validErrror;

  return "";
};

export const emptyValidator = (value, error) => {
  if (!value || value.length == 0) return error;
  return "";
};

export const phoneValidator = (phone, error) => {
  if (!phone || phone.length !== 10) return error;
  return "";
};
// export const passwordValidator = (password, emptyError) => {
//   if (!password || password.length <= 0) return emptyError;

//   return "";
// };

// export const nameValidator = (name, emptyError) => {
//   if (!name || name.length <= 0) return emptyError;

//   return "";
// };
