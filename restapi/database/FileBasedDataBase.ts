import * as fs from "fs";
import { IDataBase } from "./IDataBase";
import { IUserData } from "./IUserData";

export class FileBasedDataBase implements IDataBase {
  // Paths for files
  private dataPath = `data/`;
  private usersPath = `${this.dataPath}users/`;
  private usernameIDMapPath = `${this.dataPath}useridmap.json`;

  // Used to retrieve user ID by username
  private usernameIDMap: { [index: string]: number } = {};

  private connected: boolean = false;

  public async _connect(settings: any) {
    if (this.connected) {
      throw new Error("This database is already connected!");
    }
    this.connected = true;

    if (this.dataPath != "" && !fs.existsSync(this.dataPath))
      fs.mkdirSync(this.dataPath);
    if (!fs.existsSync(this.usersPath)) fs.mkdirSync(this.usersPath);

    if (fs.existsSync(this.usernameIDMapPath))
      this.usernameIDMap = JSON.parse(
        fs.readFileSync(this.usernameIDMapPath).toString()
      );
  }

  public async getUserDataById(userID: number): Promise<IUserData | null> {
    if (userID == null) return null;

    const path = `${this.usersPath}${userID}.json`;
    if (!fs.existsSync(path)) return null;

    const data = JSON.parse(fs.readFileSync(path).toString());
    return data as IUserData;
  }

  public async getIDFromUsername(username: string): Promise<number | null> {
    if (this.usernameIDMap[username.toLowerCase()])
      return this.usernameIDMap[username.toLowerCase()];
    return null;
  }

  public async getFreeID(): Promise<number> {
    const id = Math.floor(
      Math.random() * Math.min(1_000_000_000_000, Number.MAX_SAFE_INTEGER)
    );
    if (fs.existsSync(`${this.usersPath}/${id}.json`)) return this.getFreeID();
    return id;
  }

  public async getUserDataByUsername(
    username: string
  ): Promise<IUserData | null> {
    return await this.getUserDataById(
      await this.getIDFromUsername(username.toLowerCase())
    );
  }

  public async createNewUserData(username: string): Promise<IUserData | null> {
    if (this.usernameIDMap[username.toLowerCase()]) return null;

    const data: IUserData = {
      id: await this.getFreeID(),
      username: username,
    };

    return data;
  }

  public async saveUserData(data: IUserData) {
    const userFilePath = `${this.usersPath}${data.id}.json`;
    fs.writeFileSync(userFilePath, JSON.stringify(data));

    this.usernameIDMap[data.username.toLowerCase()] = data.id;
    fs.writeFileSync(
      this.usernameIDMapPath,
      JSON.stringify(this.usernameIDMap)
    );
  }
}
