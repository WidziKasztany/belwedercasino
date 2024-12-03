import { UserData } from "./UserData";

export class ServerConnection {
  private static readonly SERVER_URL = "http://localhost:8080/api/";

  private static async postRequest(
    url: string,
    body: any
  ): Promise<any | undefined> {
    const entireUrl = `${this.SERVER_URL}${url}`;
    const response = await fetch(entireUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  }

  public static async registerRequest(data: {
    username: string;
    password: string;
  }): Promise<{ success: boolean; message?: string; token?: string }> {
    try {
      const response = await this.postRequest("register", {
        user: data.username,
        password: data.password,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
    return { success: false, message: "" };
  }

  public static async loginRequest(data: {
    username: string;
    password: string;
  }): Promise<{ success: boolean; message?: string; token?: string }> {
    try {
      const response = await this.postRequest("login", {
        user: data.username,
        password: data.password,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
    return { success: false, message: "" };
  }

  public static async getData(data: { token: string }): Promise<{
    success: boolean;
    data?: UserData;
  }> {
    try {
      const response = await this.postRequest("getdata", {
        token: data.token,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
    return { success: false };
  }
  public static async addBalance(data: {
    token: string;
    amount: number;
  }): Promise<{
    success: boolean;
  }> {
    try {
      const response = await this.postRequest("addbalance", {
        token: data.token,
        amount: data.amount,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
    return { success: false };
  }
  public static async getCases(): Promise<{
    data: any;
    layout: any[];
  }> {
    try {
      const response = await this.postRequest("getcases", {});
      return response;
    } catch (error) {
      console.error(error);
    }
    return { data: {}, layout: [] };
  }
  public static async getDropsData(data: { ID: string }): Promise<null | any> {
    try {
      const response = await this.postRequest("getdropsdata", { ID: data.ID });
      return response;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  public static async openCase(data: {
    ID: string;
    token: string;
  }): Promise<null | { item: any; wearindex: number; price: number }> {
    try {
      const response = await this.postRequest("opencase", {
        caseid: data.ID,
        token: data.token,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
