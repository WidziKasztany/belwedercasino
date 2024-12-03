import { IUserData } from "./IUserData";

export interface IDataBase {
  _connect: (settings: any) => Promise<void>;

  getUserDataById: (id: number) => Promise<IUserData | null>;
  getUserDataByUsername: (username: string) => Promise<IUserData | null>;
  getFreeID: () => Promise<number>;
  getIDFromUsername: (username: string) => Promise<number | null>;

  createNewUserData: (username: string) => Promise<IUserData | null>;
  saveUserData: (data: IUserData) => Promise<void>;
}
