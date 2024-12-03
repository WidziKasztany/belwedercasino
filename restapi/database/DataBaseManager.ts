import { FileBasedDataBase } from "./FileBasedDataBase";
import { IDataBase } from "./IDataBase";

export class DataBaseManager {
  private static database: IDataBase | null = null;

  public static async getDataBase(): Promise<IDataBase> {
    if (this.database == null) {
      this.database = new FileBasedDataBase();
      await this.database._connect({});
    }
    return this.database;
  }
}
