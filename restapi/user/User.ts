import { DataBaseManager } from "../database/DataBaseManager";
import { IDataBase } from "../database/IDataBase";
import { IUserData } from "../database/IUserData";
import { Token } from "./Token";

export class User {
  private static database: IDataBase | null = null;

  public static async fromID(id: number): Promise<User | null> {
    if (User.database === null)
      User.database = await DataBaseManager.getDataBase();

    const user = new User();
    user.id = id;

    const data = await User.database.getUserDataById(id);
    if (data === null) return null;

    user.username = data.username;

    return user;
  }
  public static async fromUsername(username: string): Promise<User | null> {
    if (User.database === null)
      User.database = await DataBaseManager.getDataBase();

    const user = new User();

    const id = await User.database.getIDFromUsername(username);
    if (id === null) return null;

    user.id = id;
    user.username = (await User.database.getUserDataById(id)).username;

    return user;
  }
  public static async createNew(username: string): Promise<User> {
    if (User.database === null)
      User.database = await DataBaseManager.getDataBase();

    const id = await User.database.getIDFromUsername(username);
    if (id !== null) return await User.fromID(id);

    const data = await User.database.createNewUserData(username);
    await User._saveData(data);

    const user = new User();
    user.id = data.id;
    user.username = data.username;

    return user;
  }

  private id: number;
  private username: string;

  private constructor() {}

  private async _getData(): Promise<IUserData> {
    if (User.database === null)
      User.database = await DataBaseManager.getDataBase();

    return await User.database.getUserDataById(this.id);
  }
  private static async _saveData(data: IUserData): Promise<void> {
    if (User.database === null)
      User.database = await DataBaseManager.getDataBase();

    User.database.saveUserData(data);
  }

  // Checks if given password matches password from database
  // Only method for checking password is given to prevent accidental password leakage
  public async isPassword(password: string): Promise<boolean> {
    return (await this._getData()).password === password;
  }

  // Sets user's password and updates it in database
  public async setPassword(password: string) {
    const data = await this._getData();
    data.password = password;
    await User._saveData(data);
  }

  // Generates new token for user that can be later used for accessing parts of website
  public async createNewToken(): Promise<Token> {
    const data = await this._getData();
    if (typeof data.tokens === "undefined") data.tokens = {};

    let key = "";
    const letters =
      "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    for (let i = 0; i < 32; i++)
      key += letters.at(Math.floor(Math.random() * letters.length));

    data.tokens[key] = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    ).getTime(); // Token will be valid for 30 days
    User._saveData(data);

    return Token.getToken(`${this.id}.${key}`);
  }

  // Checks if token is valid and that it's not expired
  public async isTokenValid(token: Token): Promise<boolean> {
    if (token == null) return false;

    const data = await this._getData();

    if (typeof data.tokens === "undefined") return false;

    const now = Date.now();

    let toRemove = [];
    for (const key in data.tokens) {
      if (data.tokens[key] < now) toRemove.push(key);
    }
    if (toRemove.length != 0) {
      for (const key of toRemove) delete data.tokens[key];
      User._saveData(data);
    }

    const key = token._getKey();
    return typeof data.tokens[key] !== "undefined";
  }

  // Retrieves username
  public getUsername(): string {
    return this.username;
  }

  // Retrieves user balance
  public async getBalance(): Promise<number> {
    const data = await this._getData();
    if (data.balance === undefined) return 0;
    return data.balance;
  }

  // Adds to balance. Can be negative. No setBalance method to avoid any future problems
  // There still should be some kind of mutex here
  public async addBalance(amount: number) {
    const data = await this._getData();
    if (data.balance === undefined) data.balance = 0;
    data.balance += amount;
    await User._saveData(data);
  }
}
