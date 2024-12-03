import { User } from "./User";

export class Token {
  public static getToken(rawToken: string): Token | null {
    const splitted = rawToken.split(".");
    if (splitted.length != 2) return null;

    const id = parseInt(splitted[0]);
    if (typeof id !== "number" || isNaN(id)) return null;

    const key = splitted[1];
    if (typeof key !== "string") return null;

    const token = new Token();
    token.id = id;
    token.key = key;
    return token;
  }

  private id: number;
  private key: string;

  private constructor() {}

  public async getUser(): Promise<User | null> {
    return await User.fromID(this.id);
  }

  public _getKey(): string {
    return this.key;
  }

  public toString(): string {
    return `${this.id}.${this.key}`;
  }
}
