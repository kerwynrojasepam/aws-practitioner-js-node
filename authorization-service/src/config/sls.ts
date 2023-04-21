export const isUserAuthorized = (userName: string, password: string) =>
  process.env[userName] && process.env[userName] === password;
