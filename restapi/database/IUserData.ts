export interface IUserData {
  readonly id: number;
  readonly username: string;

  password?: string; // password for logging in
  tokens?: { [index: string]: number }; // tokens[token] = expiration date in miliseconds since epoch
  balance?: number; // account balance
}
